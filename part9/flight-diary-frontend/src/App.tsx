import { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import Diary from "./components/Diary";
import diaryService from "./services/diaryService";
import NewEntryForm from "./components/NewEntryForm";

export default function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  function handleNewDiary(newDiary: DiaryEntry) {
    setDiaries((prevDiaries) => [...prevDiaries, newDiary]);
  }

  useEffect(() => {
    async function getAllDiaries() {
      try {
        const response = await diaryService.getAll();

        setDiaries(response);
      } catch (error) {
        console.log(error);
      }
    }
    return () => {
      getAllDiaries();
    };
  }, []);

  return (
    <div>
      <h1>flight diaries</h1>
      <NewEntryForm onNewDiary={handleNewDiary} />
      <div>
        {diaries.map((diary) => (
          <Diary entry={diary} key={diary.id} />
        ))}
      </div>
    </div>
  );
}
