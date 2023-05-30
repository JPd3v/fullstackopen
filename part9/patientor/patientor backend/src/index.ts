import express from "express";
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";
import cors from "cors";

const app = express();

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));

app.use(express.json());

app.get("/api/ping", (_req, res) => {
  res.status(200).send("pong");
});

const PORT = 3001;

app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => console.log(`server listening in port ${PORT}`));
