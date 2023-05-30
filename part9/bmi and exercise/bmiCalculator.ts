export function calculateBmi(height: number, weight: number) {
  if (isNaN(height) || isNaN(weight)) {
    throw new Error("height and weight must be numbers");
  }
  try {
    const heightArray = height.toString().split("");
    heightArray.splice(1, 0, ".");
    const heightInMetters = Number(heightArray.join(""));

    const bmi = weight / (heightInMetters * heightInMetters);

    return `Normal (${bmi})`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
    return error;
  }
}

// const height = Number(process.argv[2]);
// const weight = Number(process.argv[3]);

// console.log(calculateBmi(height, weight));
