interface TotalProps {
  courses: Courses[];
}

interface Courses {
  name: string;
  exerciseCount: number;
}

export default function Total({ courses }: TotalProps) {
  return (
    <p>
      Number of exercises {courses.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
}
