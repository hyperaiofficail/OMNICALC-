export const BMICalculator = {
  id: 'health_bmi',
  name: 'BMI Calculator',
  description: 'Calculates Body Mass Index based on height and weight.',
  tags: ['health', 'fitness', 'medical'],
  inputs: ['weight', 'height', 'unit'], // unit: 'metric' or 'imperial'
  calculate: (engine, { weight, height, unit = 'metric' }) => {
    // Logic can be pure JS or use engine
    // Using engine for precision
    let formula;
    if (unit === 'metric') {
      // weight (kg) / height (m)^2
      formula = `${weight} / (${height} ^ 2)`;
    } else {
      // 703 * weight (lbs) / height (in)^2
      formula = `703 * ${weight} / (${height} ^ 2)`;
    }

    const res = engine.evaluate(formula);
    if (res.error) return res;

    const bmi = parseFloat(res.result);
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obesity';

    return {
      ...res,
      result: `${res.result} (${category})`,
      category
    };
  }
};
