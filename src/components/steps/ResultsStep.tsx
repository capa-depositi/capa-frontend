import React from 'react';
import { Results } from '../Results';

interface ResultsStepProps {
  children?: React.ReactNode;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ children }) => {
  if (children) return <>{children}</>;
  return <Results />;
};

export default ResultsStep;
