import React, { ReactNode, useEffect } from 'react';
// WorkflowShell renders step components; inputs/buttons/arrows live inside those components
import SegmentedIndicator from './ui/segmented-indicator';
import Intro from './steps/Intro';
import ProfileStep from './steps/ProfileStep';
import QuestionnaireStep from './steps/QuestionnaireStep';
import ResultsStep from './steps/ResultsStep';

interface WorkflowShellProps {
  currentStep: 1 | 2 | 3;
  /** When provided the shell renders the intro hero with a CTA button instead of the form area */
  onStart?: () => void;
  onStepChange?: (n: number) => void;
  onRequestAuth?: (mode: 'signup' | 'signin') => void;
  onSubmitProfile?: (data: { nome: string; cognome: string; email: string; eta: number }) => Promise<void>;
  children: ReactNode;
}

const steps = [
  { value: 1, label: 'Home' },
  { value: 2, label: 'Questionario' },
  { value: 3, label: 'Risultato' },
];

export const WorkflowShell: React.FC<WorkflowShellProps> = ({
  currentStep,
  onStart,
  onStepChange,
  onRequestAuth,
  onSubmitProfile,
  children,
}) => {
  const isIntro = currentStep === 1;
  const useBlueBackground = currentStep === 1 || currentStep === 2 || currentStep === 3;

  const containerClass = 'w-full min-h-screen py-4 text-white sm:py-6';

  useEffect(() => {
    if (useBlueBackground) {
      // apply template base blue to body for Home, Questionario, and Risultato
      document.body.style.background = '';
      document.body.style.backgroundColor = '#142856';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.background = '';
      document.body.style.color = '';
    }

    return () => {
      // cleanup to avoid leaking styles
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, [useBlueBackground]);

  return (
    <div className={containerClass}>
      <div className="mx-auto flex max-w-6xl flex-col px-2 sm:px-4 lg:px-8">
        {/* Tabs always visible at the top */}
          <div className="w-full">
            <SegmentedIndicator
              items={[
                { value: 'home', label: 'Home' },
                { value: 'questionario', label: 'Questionario' },
                { value: 'risultato', label: 'Risultato' },
              ]}
              active={currentStep === 1 ? 'home' : currentStep === 2 ? 'questionario' : 'risultato'}
            />
          </div>

        {/* ── STEP 1: full-screen hero with CTA ── */}
        {isIntro && onStart ? (
          <Intro onStart={onStart} />
        ) : (
          <>
            {/* Profile is now a sub-step inside Questionnaire; no standalone profile step */}

            <main className={currentStep === 2 ? 'rounded-[32px] border border-slate-200/80 bg-white/90 p-2 text-slate-900 shadow-[0_16px_60px_rgba(22,14,8,0.08)] sm:p-4' : 'rounded-[32px] border border-slate-200/80 bg-white/90 p-4 text-slate-900 shadow-[0_16px_60px_rgba(22,14,8,0.08)] sm:p-8'}>
              {currentStep === 2 && (
                <QuestionnaireStep>{children}</QuestionnaireStep>
              )}
              {currentStep === 3 && (
                <ResultsStep>{children}</ResultsStep>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
};
