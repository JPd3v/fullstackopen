import express from "express";
import { calculateBmi } from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.status(200).send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || !height || !weight) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
  const bmi = calculateBmi(height, weight);
  return res.status(200).json({ height, weight, bmi });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const exercises: number[] = daily_exercises.map((v: string | number) => Number(v));
  const targetNumber = Number(target);

  if (exercises.includes(NaN) || isNaN(targetNumber)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const response = calculateExercises(exercises, targetNumber);
  return res.status(200).json(response);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`server listen in port ${PORT}`));
