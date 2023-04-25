import Part from "./Part";

export default function Content({ parts }) {
  const totalExercises = parts.reduce(
    (prev, current) => prev + current.exercises,
    0
  );

  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}

      <h3>total of {totalExercises} exercises</h3>
    </div>
  );
}
