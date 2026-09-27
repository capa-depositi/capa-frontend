import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProfileStepProps {
  onRequestAuth?: (mode: 'signup' | 'signin') => void;
  onSubmitProfile?: (data: { nome: string; cognome: string; email: string; eta: number }) => Promise<string>;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({ onRequestAuth, onSubmitProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const f = e.target as HTMLFormElement;
    const form = new FormData(f);
    const nome = (form.get('nome') || '').toString();
    const cognome = (form.get('cognome') || '').toString();
    const email = (form.get('email') || '').toString();
    const eta = Number(form.get('eta') || 0);

    if (!onSubmitProfile) {
      setError('Azione non disponibile');
      return;
    }

    try {
      setIsLoading(true);
      const id = await onSubmitProfile({ nome, cognome, email, eta });
      setSuccess('Profilo creato con successo');
      // allow parent to navigate; keep success message briefly
      setTimeout(() => setSuccess(null), 1500);
      return id;
    } catch (err: any) {
      setError(err?.message || 'Errore durante la creazione del profilo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 flex w-full items-center justify-center">
      <div className="relative">
        <img src="/biglietto.jpg" alt="Biglietto" className="block mx-auto w-80 max-w-full object-contain rounded-lg shadow-lg" />

        <div className="mt-3 flex justify-center gap-3 relative z-30 pointer-events-auto">
          <Button type="button" variant="outline" onClick={() => onRequestAuth && onRequestAuth('signin')}>Accedi</Button>
          <Button type="button" variant="default" onClick={() => onRequestAuth && onRequestAuth('signup')}>Registrati</Button>
        </div>

        {/* Compact inline credential fields always visible so users can enter credentials directly */}
        <div className="mt-4 w-full max-w-sm mx-auto">
          <div className="grid gap-2">
            <input name="nome" placeholder="Nome" className="rounded-2xl border border-slate-200 px-3 py-2" />
            <input name="cognome" placeholder="Cognome" className="rounded-2xl border border-slate-200 px-3 py-2" />
            <input name="email" placeholder="Email" type="email" className="rounded-2xl border border-slate-200 px-3 py-2" />
            <input name="eta" placeholder="Età" type="number" min={18} className="rounded-2xl border border-slate-200 px-3 py-2" />
            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-emerald-700">{success}</div>}
            {/* Submit intentionally removed — use Accedi / Registrati to open full form */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
