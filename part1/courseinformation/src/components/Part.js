import React from "react";

export default function Part(props) {
  return (
    <div>
      <p>{props.part}</p>
      <p>{props.exercises}</p>
    </div>
  );
}
