import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/";

async function getAll() {
  const response = await axios.get<DiaryEntry[]>(`${baseUrl}diaries`);
  return response.data;
}

async function newEntry(newDiary: NewDiaryEntry) {
  const response = await axios.post<DiaryEntry>(`${baseUrl}diaries`, newDiary);
  return response.data;
}

export default { getAll, newEntry };
