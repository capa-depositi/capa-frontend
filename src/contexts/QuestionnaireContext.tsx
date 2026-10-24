import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[];
  required: boolean;
  dependsOn?: string;
  dependsValue?: string;
}

interface QuestionnaireContextType {
  profileId: string | null;
  submissionId: string | null;
  userRole: 'affittuario' | null;
  answers: Record<string, string>;
  currentQuestionIndex: number;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCurrentQuestionIndex: (index: number) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onQuestionnaireCompleted: (answers?: Record<string, string>) => Promise<void>;
  resetQuestionnaire: () => void;
  restartQuestionnaire: () => Promise<void>;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

interface QuestionnaireProviderProps {
  profileId: string | null;
  submissionId: string | null;
  userRole: 'affittuario' | null;
  onQuestionnaireCompleted: (answers?: Record<string, string>) => Promise<void>;
  onRestart: () => void;
  onRestartQuestionnaire?: () => Promise<void>;
  children: ReactNode;
}

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({
  profileId,
  submissionId,
  userRole,
  onQuestionnaireCompleted,
  onRestart,
  onRestartQuestionnaire,
  children
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetQuestionnaire = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setIsLoading(false);
    setError(null);
    onRestart();
  };

  const restartQuestionnaire = async () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setIsLoading(false);
    setError(null);
    if (onRestartQuestionnaire) {
      await onRestartQuestionnaire();
    }
  };

  const value: QuestionnaireContextType = {
    profileId,
    submissionId,
    userRole,
    answers,
    currentQuestionIndex,
    questions,
    isLoading,
    error,
    setAnswers,
    setCurrentQuestionIndex,
    setQuestions,
    setIsLoading,
    setError,
    onQuestionnaireCompleted,
    resetQuestionnaire,
    restartQuestionnaire
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};