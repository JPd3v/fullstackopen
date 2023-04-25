import Header from "./Header";
import Content from "./Content";

export default function Course({ course }) {
  return (
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
    </div>
  );
}
