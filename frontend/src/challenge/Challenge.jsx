import { useState } from "react";
import { useApi } from "../utils/api.js";

export function Challenge({
  challenge,
  showExplanation = false,
  isHistory = false,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [shouldShowExplanation, setShouldShowExplanation] =
    useState(showExplanation);
  const [error, setError] = useState(null);
  const { makeRequest } = useApi();

  const options =
    typeof challenge.options === "string"
      ? JSON.parse(challenge.options)
      : challenge.options;

  const handleOptionSelect = (challangeId, index) => {
    if (selectedOption !== null || isHistory) return;
    setSelectedOption(index);
    setShouldShowExplanation(true);
    updateChallengeAnswer(challangeId, index);
  };

  const updateChallengeAnswer = async (challangeId, index) => {
    setError(null);
    try {
      await makeRequest("challenge-answer", {
        method: "PATCH",
        body: JSON.stringify({
          challange_id: challangeId,
          selected_answer_id: index,
        }),
      });
    } catch (err) {
      setError(err.message || "Failed to update challenge answer.");
    }
  };

  const getOptionClass = (selectedAnswerId, index) => {
    if (isHistory) {
      if (index === challenge.correct_answer_id) {
        return "option correct";
      }
      if (selectedAnswerId === index && index !== challenge.correct_answer_id) {
        return "option incorrect";
      }
      return "option";
    }
    if (selectedOption === null) return "option";
    if (index === challenge.correct_answer_id) {
      return "option correct";
    }
    if (selectedOption === index && index !== challenge.correct_answer_id) {
      return "option incorrect";
    }
    return "option";
  };

  return (
    <div className="challenge-display">
      <p>
        <strong>Difficulty</strong>: {challenge.difficulty}
      </p>
      <p className="challenge-title">{challenge.title}</p>
      <div className="options">
        {options.map((option, index) => (
          <div
            className={getOptionClass(challenge.selected_answer_id, index)}
            key={index}
            onClick={() => handleOptionSelect(challenge.id, index)}
          >
            {option}
          </div>
        ))}
      </div>
      {shouldShowExplanation && selectedOption !== null && (
        <div className="explanation">
          <h4>Explanation</h4>
          <p>{challenge.explanation}</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
