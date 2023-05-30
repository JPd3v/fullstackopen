import { DiaryEntry } from "../types";

interface DiaryEntryProps {
  entry: DiaryEntry;
}

export default function Diary({ entry }: DiaryEntryProps) {
  const { comment, date, visibility, weather } = entry;
  return (
    <div>
      <p>{comment}</p>
      <p>{visibility}</p>
      <p>{weather}</p>
      <p>{date}</p>
    </div>
  );
}
