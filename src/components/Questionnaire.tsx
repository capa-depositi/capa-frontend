import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowRight, ChevronLeft, CircleDollarSign } from 'lucide-react';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
// No canonical Select in shadcn UI; use native select for question options
import QuestionCard from './QuestionCard';

const ticketSchema = z.object({
  nome: z.string().min(1, 'Il nome è obbligatorio.'),
  cognome: z.string().min(1, 'Il cognome è obbligatorio.'),
  email: z.string().min(1, "L'email è obbligatoria.").email('Inserisci un indirizzo email valido.'),
  eta: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), 'Inserisci un\'età valida.'),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface Question {
  id: string;
  text: string;
  image?: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[];
  required: boolean;
  dependsOn?: string;
  dependsValue?: string;
}

interface QuestionnaireProps {
  onSubmitProfile?: (data: { nome: string; cognome: string; email: string; eta: number }) => Promise<void>;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onSubmitProfile }) => {
  const {
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
    submissionId
  } = useQuestionnaire();

  const { setAppState } = useAppContext();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showTicket, setShowTicket] = useState(true);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const ticketForm = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { nome: '', cognome: '', email: '', eta: '' },
  });

  // Carica le domande al mount
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/questions/affittuario');

        // Defensive parsing: some error responses or empty bodies may cause response.json() to throw
        let data = null;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          // If parse fails, convert to a controlled error so UI can show a message
          throw new Error('Invalid JSON received from server');
        }

        if (!response.ok) {
          throw new Error((data && data.error) ? data.error : 'Errore nel caricamento delle domande');
        }

        // L'API restituisce colonne snake_case e options come stringa separata da virgole
        const normalized = (Array.isArray(data) ? data : []).map((q: any) => ({
          id: q.id,
          text: q.text ?? q.question_text,
          type: q.type ?? q.question_type,
          image: q.image,
          options: Array.isArray(q.options)
            ? q.options
            : typeof q.options === 'string' && q.options
              ? q.options.split(/,(?!\s)/).map((o: string) => o.trim())
              : undefined,
          required: !!q.required,
          dependsOn: q.dependsOn ?? q.depends_on ?? undefined,
          dependsValue: q.dependsValue ?? q.depends_value ?? undefined,
        }));
        setQuestions(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [setQuestions, setIsLoading, setError]);

  // Carica le risposte precedenti solo per la submission attiva.
  useEffect(() => {
    const loadExistingAnswers = async () => {
      if (!submissionId) return;

      try {
        const response = await fetch(`/api/answers/${submissionId}`);

        if (!response.ok) {
          // Se la risposta non è ok (404, 500, etc), ignora
          console.debug('No existing answers found or error fetching');
          return;
        }

        // Defensive parsing: handle empty or non-JSON responses
        let data = null;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          console.debug('Failed to parse existing answers JSON', parseErr);
          return;
        }

        if (data && Array.isArray(data)) {
          const answersMap: Record<string, string> = {};
          data.forEach((answer: any) => {
            answersMap[answer.question_id] = answer.answer_value;
          });
          setAnswers(answersMap);
        }
      } catch (err) {
        // Ignora errori di caricamento risposte (potrebbe essere il primo accesso)
        console.debug('Error loading existing answers:', err);
      }
    };

    loadExistingAnswers();
  }, [submissionId, setAnswers]);

  // Aggiorna la risposta corrente quando cambia la domanda
  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      const questionId = questions[currentQuestionIndex].id;
      setCurrentAnswer(answers[questionId] || '');
    }
  }, [currentQuestionIndex, questions, answers]);

  // Verifica se la domanda corrente deve essere mostrata
  const shouldShowQuestion = (question: Question, answerState: Record<string, string> = answers) => {
    if (!question.dependsOn) return true;

    const dependsOnAnswer = answerState[question.dependsOn];
    return dependsOnAnswer === question.dependsValue;
  };

  const visibleQuestions = questions.filter((question) => shouldShowQuestion(question));
  const currentQuestion = questions[currentQuestionIndex];
  const currentVisibleIndex = visibleQuestions.findIndex(
    (question) => question.id === currentQuestion?.id
  );
  const totalVisibleQuestions = visibleQuestions.length || 1;
  // Debug: log counts to help diagnose mismatched display (can be removed later)
  // eslint-disable-next-line no-console
  console.debug('Questionnaire debug:', {
    questionsLength: questions.length,
    visibleQuestionsLength: visibleQuestions.length,
    currentQuestionIndex,
    currentVisibleIndex,
    displayQuestionNumber: showTicket ? 1 : (currentVisibleIndex >= 0 ? currentVisibleIndex + 1 : 1),
  });
  const displayQuestionNumber = showTicket ? 1 : (currentVisibleIndex >= 0 ? currentVisibleIndex + 1 : 1);
  // Show the full set size as the total so the user sees the final expected count from the start
  const totalQuestionsForDisplay = questions.length || 1;
  const isLastQuestion = currentVisibleIndex !== -1 && currentVisibleIndex === visibleQuestions.length - 1;

  // Determine whether answering the current question will finish the whole questionnaire
  // by checking for the next valid question index after including the currentAnswer.
  // Trova la prossima domanda valida
  function getNextValidQuestionIndex(
    startIndex: number,
    answerState: Record<string, string> = answers
  ) {
    for (let i = startIndex; i < questions.length; i++) {
      if (shouldShowQuestion(questions[i], answerState)) {
        return i;
      }
    }
    return questions.length; // Fine del questionario
  }

  const projectedNextIndex = getNextValidQuestionIndex(currentQuestionIndex + 1, {
    ...answers,
    [currentQuestion?.id || '']: currentAnswer
  });
  const willCompleteOnNext = projectedNextIndex >= questions.length;

  

  // Gestisce il cambio di risposta
  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  // Salva la risposta corrente e passa alla prossima domanda
  const handleNext = async () => {
    if (!currentQuestion || isAdvancing) return;

    setIsAdvancing(true);
    try {
      if (submissionId) {
        const response = await fetch('/api/answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            submissionId,
            questionId: currentQuestion.id,
            value: currentAnswer
          }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Errore durante il salvataggio della risposta');
        }
      } else {
        throw new Error('Submission non disponibile');
      }

      const updatedAnswers = {
        ...answers,
        [currentQuestion.id]: currentAnswer
      };

      // Aggiorna le risposte locali
      setAnswers(updatedAnswers);

      // Trova la prossima domanda valida usando anche la risposta salvata
      const nextIndex = getNextValidQuestionIndex(currentQuestionIndex + 1, updatedAnswers);

      if (nextIndex >= questions.length) {
        await onQuestionnaireCompleted(updatedAnswers);
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
    } finally {
      setIsAdvancing(false);
    }
  };

  // Gestisce il pulsante precedente
  const handlePrevious = () => {
    let prevIndex = currentQuestionIndex - 1;
    while (prevIndex >= 0 && !shouldShowQuestion(questions[prevIndex])) {
      prevIndex--;
    }
    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
    }
  };

  // Verifica se possiamo procedere
  const canProceed = currentAnswer.trim() !== '';

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Caricamento domande...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!currentQuestion) {
    // If no questions but ticket is shown, render ticket UI
    if (showTicket) {
      // fall through to render ticket below
    } else {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Nessuna domanda disponibile.</p>
        </div>
      );
    }
  }

  const onSubmitTicket = async (data: TicketFormValues) => {
    setIsSubmittingTicket(true);
    setTicketError(null);
    try {
      await onSubmitProfile?.({
        nome: data.nome,
        cognome: data.cognome,
        email: data.email,
        eta: Number(data.eta || 0)
      });

      const ticketAnswers = {
        ...answers,
        ticket_nome: data.nome,
        ticket_cognome: data.cognome,
        ticket_email: data.email,
        ticket_eta: data.eta || ''
      };
      setAnswers(ticketAnswers);
      setError(null);

      setAppState('questionnaire');
      window.history.pushState({ appState: 'questionnaire' }, '', '?step=questionnaire');

      const firstIndex = getNextValidQuestionIndex(0, ticketAnswers);
      if (firstIndex >= questions.length) {
        setShowTicket(false);
        await onQuestionnaireCompleted(ticketAnswers);
      } else {
        setCurrentQuestionIndex(firstIndex);
        setShowTicket(false);
      }
    } catch (err) {
      setTicketError(err instanceof Error ? err.message : 'Errore durante la creazione del questionario');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={showTicket ? 'space-y-4' : 'space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6'}>
        {showTicket ? (
          <div style={{ margin: '8px' }}>
            <Card className="overflow-hidden" style={{ boxShadow: '0 22px 44px rgba(22,14,8,0.32)' }}>
              <img
                src="/biglietto.png"
                alt="Biglietto"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <form onSubmit={ticketForm.handleSubmit(onSubmitTicket)}>
                <CardContent>
                  {ticketError && <p className="mb-4 text-sm text-red-700">{ticketError}</p>}
                  <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Controller
                      name="nome"
                      control={ticketForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                          <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Mario" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="cognome"
                      control={ticketForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Cognome</FieldLabel>
                          <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Rossi" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="email"
                      control={ticketForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} placeholder="mario@email.com" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="eta"
                      control={ticketForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Età</FieldLabel>
                          <Input {...field} id={field.name} inputMode="numeric" aria-invalid={fieldState.invalid} placeholder="30" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </CardContent>
                <CardFooter className="justify-center border-t-0 bg-transparent pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingTicket}
                    className="uppercase tracking-widest font-semibold text-white"
                    style={{ backgroundColor: '#b92b22', padding: '12px 28px', borderRadius: 6, boxShadow: '0 4px 0 rgba(0,0,0,0.12)' }}
                  >
                    {isSubmittingTicket ? 'Creazione in corso...' : 'Entra nel circo →'}
                  </button>
                </CardFooter>
              </form>
            </Card>
          </div>
        ) : (
          <div>
            {currentQuestion ? (
              <QuestionCard
                image={(currentQuestion as any).image}
                progress={Math.round((displayQuestionNumber / totalQuestionsForDisplay) * 100)}
                title={`Domanda ${displayQuestionNumber} di ${totalQuestionsForDisplay}`}
                description={currentQuestion.text}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Caricamento domanda...</p>
              </div>
            )}
          </div>
        )}

        {!showTicket && currentQuestion && (
          <div className="mt-3">
            {currentQuestion.type === 'select' && currentQuestion.options && (
            <div>
              <label className="sr-only">Risposta</label>
              <select
                value={currentAnswer}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAnswerChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2"
              >
                <option value="">Seleziona una risposta</option>
                {currentQuestion.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
            {(currentQuestion.type === 'text' || currentQuestion.type === 'number') && (
              <div>
                <label className="sr-only">Risposta</label>
                <Input
                  type={currentQuestion.type}
                  value={currentAnswer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(e.target.value)}
                  placeholder="Inserisci la tua risposta"
                  className="rounded-2xl border-slate-300"
                />
              </div>
            )}

            {currentQuestion.type === 'date' && (
              <div>
                <label className="sr-only">Risposta</label>
                <Input
                  type="date"
                  value={currentAnswer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(e.target.value)}
                  className="rounded-2xl border-slate-300"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!showTicket && (
          <>
            <Button
              variant="default"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="rounded-full"
            >
              <ChevronLeft size={16} className="mr-1" />
              Precedente
            </Button>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!canProceed || isAdvancing}
              className="rounded-full"
            >
              {isAdvancing ? 'Salvataggio...' : willCompleteOnNext ? 'Completa Questionario' : 'Avanti'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};