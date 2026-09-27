import React, { useState } from 'react';
// Use native select element styled via Tailwind (canonical UI lacks a Select component)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { Sparkles, UserCircle2 } from 'lucide-react';

interface ProfileFormProps {
  onProfileCreated: (profileId: string, questionnaireCompleted?: boolean) => void;
  defaultMode?: 'signup' | 'signin';
}


type AuthMode = 'signup' | 'signin';

export const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileCreated, defaultMode = 'signup' }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(defaultMode);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    eta: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const route = authMode === 'signin' ? '/api/profiles/login' : '/api/profiles';
      const body = authMode === 'signin'
        ? { email: formData.email }
        : {
            nome: formData.nome,
            cognome: formData.cognome,
            eta: parseInt(formData.eta),
            email: formData.email,
            ruolo: 'affittuario'
          };

      const response = await fetch(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore durante l'accesso");
      }

      onProfileCreated(
        data.profileId,
        data.questionnaireCompleted || false
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = authMode === 'signin'
    ? Boolean(formData.email)
    : Boolean(formData.nome && formData.cognome && formData.eta && formData.email);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-900 p-2 text-amber-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {authMode === 'signin' ? 'Bentornato' : 'Iniziamo con il tuo profilo'}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {authMode === 'signin'
                ? 'Accedi con la tua email per riprendere il questionario.'
                : 'Inserisci i tuoi dati per iniziare il questionario.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant={authMode === 'signup' ? 'default' : 'outline'}
          onClick={() => setAuthMode('signup')}
          className="rounded-full"
        >
          Registrati
        </Button>
        <Button
          type="button"
          variant={authMode === 'signin' ? 'default' : 'outline'}
          onClick={() => setAuthMode('signin')}
          className="rounded-full"
        >
          Accedi
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
        {authMode === 'signup' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                  <FieldContent>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="cognome">Cognome</FieldLabel>
                <FieldContent>
                  <Input
                    id="cognome"
                    name="cognome"
                    type="text"
                    value={formData.cognome}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="eta">Età</FieldLabel>
                <FieldContent>
                  <Input
                    id="eta"
                    name="eta"
                    type="number"
                    min="18"
                    max="120"
                    value={formData.eta}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>
            </div>

          </>
        )}

        {authMode === 'signin' && (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-700">
                <UserCircle2 size={16} />
                <span className="text-sm font-medium">Accesso rapido</span>
              </div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              Inserisci l'email usata in fase di registrazione. Se non hai ancora un profilo,
              passa a <strong>Registrati</strong> per crearne uno.
            </p>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (authMode === 'signin' ? 'Accesso in corso...' : 'Creazione profilo...') : (authMode === 'signin' ? 'Accedi' : 'Registrati e inizia')}
        </Button>
      </form>
    </div>
  );
};