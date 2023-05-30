import { randomUUID } from "crypto";
import {
  Diagnose,
  Entry,
  Gender,
  Patient,
  EntryTypes,
  HealthCheckRating,
  OccupationalHealthcareEntry,
  SickLeave,
  HospitalEntry,
  Discharge,
} from "./types";

function isString(text: unknown): text is string {
  return typeof text === "string" || text instanceof String;
}

function parseName(name: unknown): string {
  if (!name || !isString(name)) {
    throw new Error("invalid or missing name");
  }

  return name;
}

function parseSsn(ssn: unknown): string {
  if (!ssn || !isString(ssn)) {
    throw new Error("invalid or missing ssn");
  }

  return ssn;
}

function parseOccupation(occupation: unknown): string {
  if (!occupation || !isString(occupation)) {
    throw new Error("invalid or missing occupation");
  }

  return occupation;
}

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

function parseDateOfBirth(dateOfBirth: unknown): string {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("invalid or missing dateOfBirth");
  }

  return dateOfBirth;
}

function isGender(param: string): param is Gender {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
}

function parseGender(gender: unknown): Gender {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("invalid or missing dateOfBirth");
  }

  return gender;
}

export function toNewPatientEntry(object: unknown): Patient {
  const id = randomUUID();

  if (!object || typeof object !== "object") {
    throw new Error("incorrect or missing data");
  }

  if (
    "name" in object &&
    "ssn" in object &&
    "occupation" in object &&
    "gender" in object &&
    "dateOfBirth" in object
  ) {
    const newPatient: Patient = {
      name: parseName(object.name),
      ssn: parseSsn(object.ssn),
      occupation: parseOccupation(object.occupation),
      gender: parseGender(object.gender),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      id,
      entries: [],
    };
    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
}

export const parseDiagnosisCodes = (object: unknown): Array<Diagnose["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return object as Array<Diagnose["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnose["code"]>;
};

function isType(param: string): param is EntryTypes {
  return Object.values(EntryTypes)
    .map((g) => g.toString())
    .includes(param);
}

function parseType(type: unknown): EntryTypes {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error("invalid or missing type");
  }

  return type;
}

function parseDate(date: unknown): string {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("invalid or missing date");
  }

  return date;
}

function parseDescription(description: unknown): string {
  if (!description || !isString(description)) {
    throw new Error("invalid or missing description");
  }

  return description;
}

function parseSpecialist(specialist: unknown): string {
  if (!specialist || !isString(specialist)) {
    throw new Error("invalid or missing specialist");
  }

  return specialist;
}

function isRating(param: number): param is HealthCheckRating {
  return Object.values(HealthCheckRating)
    .map((g) => Number(g))
    .includes(param);
}

function toNumber(param: unknown): param is number {
  return typeof param === "number" || param instanceof Number;
}

function parseHealthCheckRating(rating: unknown): HealthCheckRating {
  if (!rating || !toNumber(rating) || isNaN(rating) || !isRating(rating)) {
    throw new Error("invalid or missing rating");
  }

  return rating;
}

function parseEmployerName(employerName: unknown): string {
  if (!employerName || !isString(employerName)) {
    throw new Error("invalid or missing employerName");
  }

  return employerName;
}

function isSickLeave(sickLeave: unknown): sickLeave is SickLeave {
  if (!sickLeave) return false;
  return (
    typeof sickLeave === "object" &&
    "startDate" in sickLeave &&
    "endDate" in sickLeave &&
    isString(sickLeave.startDate) &&
    isString(sickLeave.endDate)
  );
}

function isValidSickLeave(sickLeave: SickLeave): SickLeave {
  const { endDate, startDate } = sickLeave;

  if (!isDate(endDate) || !isDate(startDate)) {
    throw new Error("sick leave end or start date must be a valid date");
  }

  return sickLeave;
}

function parseSickLeave(parseSickLeave: unknown): SickLeave {
  if (
    !parseSickLeave ||
    !isSickLeave(parseSickLeave) ||
    !isValidSickLeave(parseSickLeave)
  ) {
    throw new Error("invalid or missing sickLeave");
  }

  return parseSickLeave;
}

function isDischarge(discharge: unknown): discharge is Discharge {
  if (!discharge) return false;
  return (
    typeof discharge === "object" &&
    "date" in discharge &&
    "criteria" in discharge &&
    isString(discharge.date) &&
    isString(discharge.criteria)
  );
}

function isValidDischarge(discharge: Discharge) {
  const { date, criteria } = discharge;

  if (!isDate(date)) {
    throw new Error("discharge date should be a valid date");
  }
  if (!isString(criteria)) {
    throw new Error("critera should be a string");
  }

  return discharge;
}

function parseDischarge(discharge: unknown): Discharge {
  if (!discharge || !isDischarge(discharge) || !isValidDischarge(discharge)) {
    throw new Error("invalid or missing discharge");
  }

  return discharge;
}

export function toNewEntry(object: unknown): Entry {
  const id = randomUUID();

  if (!object || typeof object !== "object") {
    throw new Error("incorrect or missing data");
  }

  if (
    "type" in object &&
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "diagnosisCodes" in object
  ) {
    const type = parseType(object.type);
    const baseEntry: Entry = {
      date: parseDate(object.date),
      description: parseDescription(object.description),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
      id,
    };

    if (type === "HealthCheck") {
      if ("healthCheckRating" in object) {
        const healtCheckEntry = {
          ...baseEntry,
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          type,
        };

        return healtCheckEntry;
      }
      throw new Error("Incorrect data: missing healthCheckRating field");
    }
    if (type === "OccupationalHealthcare") {
      if ("employerName" in object) {
        const OccupationalHealthcareEntry: OccupationalHealthcareEntry = {
          ...baseEntry,
          type,
          employerName: parseEmployerName(object.employerName),
        };

        if ("sickLeave" in object) {
          OccupationalHealthcareEntry.sickLeave = parseSickLeave(object.sickLeave);
        }

        return OccupationalHealthcareEntry;
      }

      throw new Error("Incorrect data: missing employerName field");
    }
    if (type === "Hospital") {
      if ("discharge" in object) {
        const OccupationalHealthcareEntry: HospitalEntry = {
          ...baseEntry,
          type,
          discharge: parseDischarge(object.discharge),
        };
        return OccupationalHealthcareEntry;
      }
      throw new Error("Incorrect data: missing discharge field");
    }
  }

  throw new Error("Incorrect data: some fields are missing");
}
