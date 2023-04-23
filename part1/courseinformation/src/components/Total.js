import React from "react";

export default function Total({ parts }) {
  const totalExercises = parts.reduce(
    (prev, current) => prev + current.exercises,
    0
  );
  return <p>Number of exercises {totalExercises}</p>;
}
