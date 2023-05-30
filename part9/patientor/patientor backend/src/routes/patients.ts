import { Router } from "express";
import patientsService from "../services/patientsService";
import { toNewEntry, toNewPatientEntry } from "../utils";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json(patientsService.getAll());
});
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const patient = patientsService.getPatient(id);
  if (patient) {
    return res.status(200).json(patient);
  }

  return res.status(404).json({ error: "patient no found" });
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);

    const addedPatient = patientsService.add(newPatient);

    return res.status(201).json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});
router.post("/:id/entries", (req, res) => {
  try {
    const { id } = req.params;

    const newEntry = toNewEntry(req.body);

    const addedEntry = patientsService.addEntry(id, newEntry);

    return res.status(201).json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

export default router;
