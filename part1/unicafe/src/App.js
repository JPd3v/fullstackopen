import { useState } from "react";
import Statistics from "./components/Statistics";
import Feedback from "./components/Feedback";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodVote = () => setGood((prev) => prev + 1);
  const handleNeutralVote = () => setNeutral((prev) => prev + 1);
  const handleBadVote = () => setBad((prev) => prev + 1);

  return (
    <div>
      <Feedback
        handleGoodVote={handleGoodVote}
        handleNeutralVote={handleNeutralVote}
        handleBadVote={handleBadVote}
      />
      <Statistics goodVotes={good} neutralVotes={neutral} badVotes={bad} />
    </div>
  );
};

export default App;
