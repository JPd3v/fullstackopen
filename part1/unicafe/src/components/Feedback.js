import React from "react";
import Button from "./Button";

export default function Feedback({
  handleGoodVote,
  handleNeutralVote,
  handleBadVote,
}) {
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => handleGoodVote()} text="good" />
      <Button handleClick={() => handleNeutralVote()} text="neutral" />
      <Button handleClick={() => handleBadVote()} text="bad" />
    </div>
  );
}
