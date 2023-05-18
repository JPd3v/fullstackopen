import { useState } from "react";

export function useField(type) {
  const [value, setValue] = useState("");

  function onChange(event) {
    if (!event) {
      return setValue("");
    }
    setValue(event.target.value);
  }

  function clear() {
    setValue("");
  }

  return {
    type,
    value,
    onChange,
    // clear,
  };
}
