import { useState, useEffect } from "react";
import { Challenge } from "../challenge/Challenge.jsx";
import { useApi } from "../utils/api.js";
import { Stats } from "./Stats.jsx";

export function HistoryPanel() {
  const { makeRequest } = useApi();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await makeRequest("my-history");
      setData(data);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchHistory}>Retry</button>
      </div>
    );
  }

  return (
    <div className="history-panel">
      <h2>History</h2>
      {data.challenges.length === 0 ? (
        <p>No challenge history</p>
      ) : (
        <>
          <Stats data={data} />
          <hr />
          <div className="history-list">
            {data.challenges.map((challenge) => {
              return (
                <Challenge
                  challenge={challenge}
                  key={challenge.id}
                  showExplanation
                  isHistory
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
