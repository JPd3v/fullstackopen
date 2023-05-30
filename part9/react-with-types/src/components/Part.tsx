import { CoursePart } from "../App";

interface PartProps {
  coursePart: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export default function Part({ coursePart }: PartProps) {
  switch (coursePart.kind) {
    case "basic":
      return (
        <div>
          <h2>{coursePart.name}</h2>
          <p>{coursePart.description}</p>
          <p>{coursePart.exerciseCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h2>{coursePart.name}</h2>
          <p>{coursePart.description}</p>
          <p>{coursePart.backgroundMaterial}</p>
          <p>{coursePart.exerciseCount}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h2>{coursePart.name}</h2>
          <p>{coursePart.groupProjectCount}</p>
          <p>{coursePart.exerciseCount}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <h2>{coursePart.name}</h2>
          <p>{coursePart.description}</p>
          <div>
            {coursePart.requirements.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
          <p>{coursePart.exerciseCount}</p>
        </div>
      );
    default:
      return assertNever(coursePart);
  }
}
