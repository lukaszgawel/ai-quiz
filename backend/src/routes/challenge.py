from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..ai_generator import generate_challenge_with_ai
from ..database.db import (
    get_quota,
    create_challenge,
    create_quota,
    reset_quota_if_needed,
    get_challenges,
    update_challange_answer
)
from ..database.models import get_db
import json
from datetime import datetime

router = APIRouter()


class ChallengeRequest(BaseModel):
    difficulty: str

    class Config:
        json_schema_extra = {"example": {"difficulty": "easy"}}

class ChallengeAnswerRequest(BaseModel):
    challange_id: int
    selected_answer_id: int

    class Config:
        json_schema_extra = {"example": {"challange_id": 1, "selected_answer_id": 1}}


@router.post("/generate-challenge")
async def generate_challenge(request: ChallengeRequest, db: Session = Depends(get_db)):
    try:
        quota = get_quota(db)
        if not quota:
            quota = create_quota(db)
        quota = reset_quota_if_needed(db, quota)

        if quota.quota_remaining <= 0:
            raise HTTPException(status_code=429, detail="Quota exhausted")

        challenge_data = generate_challenge_with_ai(request.difficulty)
        new_challenge = create_challenge(
            db=db,
            difficulty=request.difficulty,
            title=challenge_data.question,
            options=json.dumps(challenge_data.options),
            correct_answer_id=challenge_data.correct_answer_id,
            explanation=challenge_data.explanation
        )
        quota.quota_remaining -= 1
        db.commit()

        return {
            "id": new_challenge.id,
            "difficulty": request.difficulty,
            "title": new_challenge.title,
            "options": json.loads(new_challenge.options),
            "correct_answer_id": new_challenge.correct_answer_id,
            "explanation": new_challenge.explanation,
            "timestamp": new_challenge.date_created.isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/my-history")
async def my_history(request: Request, db: Session = Depends(get_db)):
    challenges = get_challenges(db)

    stats = {
        "easy": {
            "count": 0,
            "answered": 0,
            "correct": 0
        },
        "medium": {
            "count": 0,
            "answered": 0,
            "correct": 0
        },
        "hard": {
            "count": 0,
            "answered": 0,
            "correct": 0
        }
    }
    for c in challenges:
        stats[c.difficulty]["count"] += 1
        if c.selected_answer_id is not None:
            stats[c.difficulty]["answered"] += 1
            if c.selected_answer_id == c.correct_answer_id:
                stats[c.difficulty]["correct"] += 1

    return {"challenges": challenges,
            "stats": stats}


@router.get("/quota")
async def get_challenge_quota(request: Request, db: Session = Depends(get_db)):
    quota = get_quota(db)
    if not quota:
        quota = create_quota(db)
    elif not quota.quota_remaining:
        return {
            "quota_remaining": 0,
            "last_reset_date": datetime.now()
        }

    quota = reset_quota_if_needed(db, quota)
    return quota


@router.patch("/challenge-answer")
async def update_challenge(request: ChallengeAnswerRequest, db: Session = Depends(get_db)):
    update_challange_answer(db, request.challange_id, request.selected_answer_id)

