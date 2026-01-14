import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initRegistry } from './engine/CalculatorRegistry';
import { ScientificCalculator } from './calculators/ScientificCalculator';
import { BMICalculator } from './calculators/BMICalculator';
import { LoanCalculator } from './calculators/LoanCalculator';

// Initialize Calculators
initRegistry([
  {
    id: 'scientific',
    name: 'Scientific Calculator',
    description: 'Advanced math calculator with trig, log, and exponential functions.',
    tags: ['math', 'science', 'algebra', 'trig'],
    component: ScientificCalculator
  },
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index based on height and weight.',
    tags: ['health', 'fitness', 'medical'],
    component: BMICalculator
  },
  {
    id: 'loan',
    name: 'Loan Calculator',
    description: 'Calculate monthly payments for loans and mortgages.',
    tags: ['finance', 'business', 'money', 'mortgage'],
    component: LoanCalculator
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
