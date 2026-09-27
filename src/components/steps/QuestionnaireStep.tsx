import React from 'react';
import { Questionnaire } from '../Questionnaire';

interface QuestionnaireStepProps {
  children?: React.ReactNode;
}

export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({ children }) => {
  if (children) return <>{children}</>;
  return <Questionnaire />;
};

export default QuestionnaireStep;
