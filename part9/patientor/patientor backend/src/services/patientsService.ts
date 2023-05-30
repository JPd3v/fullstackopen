import patients from "../data/patients";
import { Entry, Patient, PatientWithoutSsn } from "../types";

function getAll(): PatientWithoutSsn[] {
  return patients.map((p) => {
    const { dateOfBirth, gender, id, name, occupation, entries } = p;
    return { dateOfBirth, gender, id, name, occupation, entries };
  });
}
function getPatient(id: string): PatientWithoutSsn | undefined {
  const patient = patients.find((p) => p.id === id);

  if (patient) {
    const { dateOfBirth, gender, id, name, occupation, entries } = patient;
    return { dateOfBirth, gender, id, name, occupation, entries };
  }
  return patient;
}

function add(patient: Patient) {
  patients.push(patient);

  return patient;
}

function addEntry(id: string, entry: Entry) {
  const patient = patients.find((patient) => patient.id === id);
  if (!patient) {
    throw new Error("patient doesnt exists");
  }
  patient?.entries?.push(entry);
  return entry;
}

export default {
  getAll,
  add,
  getPatient,
  addEntry,
};
