import { CoursePart } from "../App";
import Part from "./Part";

interface ContentProps {
  courses: CoursePart[];
}

export default function Content({ courses }: ContentProps) {
  return (
    <div>
      {courses.map((course) => (
        <Part key={course.name} coursePart={course} />
      ))}
    </div>
  );
}
