import React from "react";
import Part from "./Part";

export default function Content({ parts }) {
  return (
    <div>
      {parts.map((element) => (
        <Part part={element.name} exercises={element.exercises} />
      ))}
    </div>
  );
}
