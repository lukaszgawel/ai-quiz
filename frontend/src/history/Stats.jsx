export function Stats({ data }) {
  return (
    <div className="statistics-list">
      <h3>Statistics</h3>
      <div>All questions: {data.challenges.length}</div>
      <table className="table">
        <tr>
          <th></th>
          <th>Easy</th>
          <th>Medium</th>
          <th>Hard</th>
        </tr>
        <tr>
          <td>Count</td>
          <td>{data.stats.easy.count}</td>
          <td>{data.stats.medium.count}</td>
          <td>{data.stats.hard.count}</td>
        </tr>
        <tr>
          <td>Answered</td>
          <td>{data.stats.easy.answered}</td>
          <td>{data.stats.medium.answered}</td>
          <td>{data.stats.hard.answered}</td>
        </tr>
        <tr>
          <td>Correct</td>
          <td>{data.stats.easy.correct}</td>
          <td>{data.stats.medium.correct}</td>
          <td>{data.stats.hard.correct}</td>
        </tr>
      </table>
    </div>
  );
}
