import { useState } from "react";
import { DiaryEntry, Visibility, Weather } from "../types";
import diaryService from "../services/diaryService";
import axios from "axios";

interface NewEntryFormProps {
  onNewDiary: (newDiary: DiaryEntry) => void;
}

export default function NewEntryForm({ onNewDiary }: NewEntryFormProps) {
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>();
  const [weather, setWeather] = useState<Weather>();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!visibility || !weather) {
      return;
    }
    try {
      const response = await diaryService.newEntry({
        comment,
        date,
        weather,
        visibility,
      });
      onNewDiary(response);
      setComment("");
      setDate("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data);
      }
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <p>
        <strong>{error}</strong>
      </p>
      <h1>New diary</h1>
      <label htmlFor="comment">
        comment
        <input
          type="text"
          value={comment}
          id="comment"
          onChange={({ target }) => setComment(target.value)}
        ></input>
      </label>
      <br />

      <label htmlFor="date">
        date
        <input
          type="date"
          id="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        ></input>
      </label>
      <br />
      <label htmlFor="visibility">
        visibility
        {Object.values(Visibility).map((element) => (
          <label htmlFor={element} key={element}>
            {element}
            <input
              type="radio"
              id={element}
              name="visibility"
              value={element}
              onChange={({ target }) => setVisibility(target.value as Visibility)}
            ></input>
          </label>
        ))}
      </label>
      <br />

      <label htmlFor="weather">
        Weather
        {Object.values(Weather).map((element) => (
          <label htmlFor={element} key={element}>
            {element}
            <input
              type="radio"
              id={element}
              name="weather"
              value={element}
              onChange={({ target }) => setWeather(target.value as Weather)}
            ></input>
          </label>
        ))}
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  );
}
