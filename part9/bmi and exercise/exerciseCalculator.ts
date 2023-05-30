interface exerciceResponse {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export default function calculateExercises(
  daysWorkout: number[],
  target: number
): exerciceResponse | string | unknown {
  if (daysWorkout.includes(NaN) || isNaN(target)) {
    throw new Error("target should be a number and daysWorkout should be numbers");
  }
  try {
    const average =
      daysWorkout.reduce((acc, current) => acc + current, 0) / daysWorkout.length;

    let rating = 0;
    let ratingDescription = "";

    if ((average * 100) / target > 25) {
      rating = 1;
      ratingDescription = "very bad";
    }

    if ((average * 100) / target > 50) {
      rating = 2;
      ratingDescription = "not too bad but could be better";
    }
    if (average >= target) {
      rating = 3;
      ratingDescription = "very good";
    }

    return {
      periodLength: daysWorkout.length,
      trainingDays: daysWorkout.filter((v) => v !== 0).length,
      success: average >= target,
      rating,
      ratingDescription,
      target: target,
      average,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
    return error;
  }
}

// const [target, ...days] = process.argv.slice(2);

// const daysNumbers = days.map((v) => Number(v));
// const targetNumbers = Number(target);

// console.log(calculateExercises(daysNumbers, targetNumbers));
