import React from "react";
import StatisticLine from "./StatisticLine";

export default function Statistics({ goodVotes, neutralVotes, badVotes }) {
  const allVotes = goodVotes + neutralVotes + badVotes;
  const average = (goodVotes - badVotes) / allVotes || 0;
  const positiveFeedback = (goodVotes * 100) / allVotes + " %";
  return (
    <div>
      <h1>statistics</h1>
      {allVotes ? (
        <table>
          <tbody>
            <StatisticLine text="good" value={goodVotes} />
            <StatisticLine text="neutral" value={neutralVotes} />
            <StatisticLine text="bad" value={badVotes} />
            <StatisticLine text="all" value={allVotes} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positiveFeedback} />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
}
