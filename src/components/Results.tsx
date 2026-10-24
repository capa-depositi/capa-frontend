import React, { useEffect, useState } from 'react';
import { BadgeCheck, CircleDollarSign, RotateCcw } from 'lucide-react';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';

interface CalculationResult {
  submissionId: string;
  submissionStatus: 'in_progress' | 'completed';
  emailStatus: 'not_sent' | 'sending' | 'sent' | 'failed';
  deposit: number;
  interest: number;
  years: number;
  monthlyRent?: number;
  months?: number;
  depositDate?: string;
  message?: string;
}

export const Results: React.FC = () => {
  const { submissionId, isLoading, setIsLoading, setError, error, resetQuestionnaire, restartQuestionnaire } = useQuestionnaire();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const resultToken = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    const calculateInterest = async () => {
      if (!submissionId && !resultToken) return;

      setIsLoading(true);
      try {
        const response = resultToken
          ? await fetch(`/api/risultato/${resultToken}`)
          : await fetch('/api/calculate-interest', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ submissionId }),
            });

        // Read raw text first to guard against empty or invalid JSON responses
        const text = await response.text();

        if (!text) {
          // No body returned
          if (!response.ok) {
            throw new Error('Errore nel calcolo degli interessi');
          }
          setError('Il server non ha restituito risultati. Riprova più tardi.');
          return;
        }

        let data: any;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          throw new Error('Risposta non valida dal server (JSON non valido)');
        }

        if (!response.ok) {
          if (response.status === 410) {
            throw new Error('Il link per rivedere il risultato è scaduto.');
          }
          if (response.status === 404 && resultToken) {
            throw new Error('Il link per rivedere il risultato non è valido.');
          }
          throw new Error(data?.error || 'Errore nel calcolo degli interessi');
        }

        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nel calcolo');
      } finally {
        setIsLoading(false);
      }
    };

    calculateInterest();
  }, [submissionId, resultToken, setIsLoading, setError]);

  const handleRestart = () => {
    resetQuestionnaire();
  };

  const handleNewQuestionnaire = () => {
    restartQuestionnaire().catch(err => setError(err instanceof Error ? err.message : 'Errore durante la creazione del questionario'));
  };

  const handleRetryEmail = async () => {
    if (!result?.submissionId) return;
    setIsRetryingEmail(true);
    try {
      const response = await fetch(`/api/submissions/${result.submissionId}/complete`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossibile inviare l'email");
      setResult(current => current ? { ...current, emailStatus: data.emailStatus } : current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile inviare l'email");
    } finally {
      setIsRetryingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Calcolo degli interessi in corso...</p>
      </div>
    );
  }

  if (error) {
    const userError = error === 'Questionnaire not completed'
      ? 'Il questionario non è stato completato. Assicurati di aver risposto a tutte le domande.'
      : error;

    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg">
        <p className="text-center text-lg font-medium">{userError}</p>
        <div className="mt-4 text-center">
          <Button onClick={handleRestart} variant="outline">
            Torna all'inizio
          </Button>
        </div>
      </div>
    );
  }

  if (!submissionId && !resultToken) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-5 rounded-lg">
        <p className="text-center text-lg font-medium">Profilo mancante</p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Non posso calcolare gli interessi perché non è stato creato un profilo valido.
          Torna all'inizio e ripeti il questionario.
        </p>
        <div className="mt-4 text-center">
          <Button onClick={handleRestart} variant="outline">
            Torna all'inizio
          </Button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-5 rounded-lg">
        <p className="text-center text-lg font-medium">Calcolo non disponibile</p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Il calcolo non ha prodotto risultati. Assicurati di aver completato tutte le domande
          e riprova dal questionario.
        </p>
        <div className="mt-4 text-center">
          <Button onClick={handleRestart} variant="outline">
            Nuovo Questionario
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!resultToken && result.submissionStatus === 'completed' && result.emailStatus === 'failed' && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p>Il risultato è pronto, ma l'email non è stata inviata.</p>
          <Button onClick={handleRetryEmail} disabled={isRetryingEmail} variant="outline">
            {isRetryingEmail ? 'Invio in corso...' : 'Riprova invio email'}
          </Button>
        </div>
      )}
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
              <BadgeCheck size={14} />
              Calcolo completato
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Risultati del calcolo
            </h2>
          </div>
          <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700">
            Sintesi chiara e immediata
          </div>
        </div>
      </div>

      {result.message ? (
        <div className="rounded-3xl border border-blue-200 bg-blue-50 px-6 py-4 text-blue-800">
          <p className="text-lg font-medium">{result.message}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-amber-400">
              <CircleDollarSign size={16} />
              Interessi totali generati
            </div>
            <p className="mt-3 text-4xl font-semibold sm:text-5xl">
              €{result.interest.toFixed(2)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Deposito cauzionale</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                €{result.deposit.toFixed(2)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Anni di calcolo</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {result.years}
              </p>
              {result.years === 0 && result.interest > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  Calcolo parziale su un periodo inferiore a un anno.
                </p>
              )}
            </div>
          </div>

          {result.monthlyRent && result.months && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Dettagli deposito</p>
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-slate-500">Affitto mensile:</span>
                  <span className="ml-2 font-medium text-slate-900">€{result.monthlyRent}</span>
                </div>
                <div>
                  <span className="text-slate-500">Mesi deposito:</span>
                  <span className="ml-2 font-medium text-slate-900">{result.months}</span>
                </div>
              </div>
              {result.depositDate && (
                <div className="mt-2 text-sm">
                  <span className="text-slate-500">Data versamento:</span>
                  <span className="ml-2 font-medium text-slate-900">{result.depositDate}</span>
                </div>
              )}
            </div>
          )}

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Nota:</strong> Questo calcolo è basato sui tassi legali italiani e considera il periodo dal versamento fino ad oggi. I risultati sono indicativi e non costituiscono un consiglio finanziario.
          </div>
        </div>
      )}

      {/* Bottom action buttons intentionally removed per design — no actions here */}
    </div>
  );
};