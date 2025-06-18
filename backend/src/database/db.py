from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from . import models


def get_quota(db: Session):
    return (db.query(models.ChallengeQuota).first())


def create_quota(db: Session):
    db_quota = models.ChallengeQuota()
    db.add(db_quota)
    db.commit()
    db.refresh(db_quota)
    return db_quota


def reset_quota_if_needed(db: Session, quota: models.ChallengeQuota):
    now = datetime.now()
    if now - quota.last_reset_date > timedelta(hours=24):
        quota.quota_remaining = 5
        quota.last_reset_date = now
        db.commit()
        db.refresh(quota)
    return quota


def create_challenge(
    db: Session,
    difficulty: str,
    title: str,
    options: str,
    correct_answer_id: int,
    explanation: str
):
    db_challenge = models.Challenge(
        difficulty=difficulty,
        title=title,
        options=options,
        correct_answer_id=correct_answer_id,
        explanation=explanation
    )
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge


def get_challenges(db: Session):
    return db.query(models.Challenge).all()


def update_challange_answer(db: Session, challange_id: int, selected_answer_id: int):
    challange_to_update = db.query(models.Challenge).filter(models.Challenge.id == challange_id).first()
    if challange_to_update:
        challange_to_update.selected_answer_id = selected_answer_id
        db.commit()