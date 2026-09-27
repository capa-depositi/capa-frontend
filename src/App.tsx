import { useState, useEffect } from 'react';
import { QuestionnaireProvider } from './contexts/QuestionnaireContext';
import { AppProvider } from './contexts/AppContext';
import { ProfileForm } from './components/ProfileForm';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { WorkflowShell } from './components/WorkflowShell';

type AppState = 'intro' | 'profile' | 'questionnaire' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'affittuario' | null>(null);
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);
  const [defaultAuthMode, setDefaultAuthMode] = useState<'signup' | 'signin'>('signup');

  const handleProfileCreated = (id: string, questionnaireCompleted: boolean = false) => {
    setProfileId(id);
    setUserRole('affittuario');
    setAppState(questionnaireCompleted ? 'results' : 'questionnaire');
  };

  const handleSubmitProfileFromTicket = async (data: { nome: string; cognome: string; email: string; eta: number }) => {
    // create profile via API and proceed. Returns profileId on success or throws on error.
      const resp = await fetch('/api/profiles', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ nome: data.nome, cognome: data.cognome, eta: data.eta, email: data.email, ruolo: 'affittuario' }) });

    const j = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      // expose error to caller so UI can show it
      const message = j && j.error ? j.error : 'Errore durante la creazione del profilo';
      // fall back to showing the full profile form
      setShowProfileForm(true);
      throw new Error(message);
    }

    handleProfileCreated(j.profileId, j.questionnaireCompleted || false);
    return j.profileId;
  };
  

  const handleQuestionnaireCompleted = async (answers?: Record<string, string>) => {
    try {
      // If we already have a profileId, just go to results
      if (profileId) {
        setAppState('results');
        return;
      }

      const email = answers?.ticket_email;
      let pid: string | null = null;

      // Try login (find existing profile) by email
      if (email) {
        try {
          const loginResp = await fetch('/api/profiles/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          if (loginResp.ok) {
            const j = await loginResp.json();
            pid = j.profileId || null;
          }
        } catch (err) {
          console.debug('Login check failed', err);
        }
      }

      // If not found, create a new profile from ticket answers
      if (!pid) {
        try {
          const created = await fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: answers?.ticket_nome || '',
              cognome: answers?.ticket_cognome || '',
              eta: answers?.ticket_eta ? Number(answers.ticket_eta) : undefined,
              email: email || '',
              ruolo: 'affittuario'
            })
          });
          if (created.ok) {
            const j = await created.json();
            pid = j.profileId || null;
          }
        } catch (err) {
          console.debug('Profile creation failed', err);
        }
      }
      if (pid) {
        setProfileId(pid);
        setUserRole('affittuario');

        // Persist all collected answers to the server
        if (answers) {
          for (const [questionId, value] of Object.entries(answers)) {
            try {
              await fetch('/api/answers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId: pid, questionId, value })
              });
            } catch (err) {
              console.debug('Failed to persist answer', questionId, err);
            }
          }
        }
      }

      // Always land on the Risultato step once the questionnaire is completed.
      // If no profile could be resolved, Results shows a "nothing to show" message instead.
      setAppState('results');
    } catch (err) {
      console.error('Error finishing questionnaire', err);
      setAppState('results');
    }
  };

  const handleRestart = () => {
    setAppState('intro');
    setProfileId(null);
    setUserRole(null);
  };

  const handleRestartQuestionnaire = () => {
    setAppState('questionnaire');
  };

  const shellStep: 1 | 2 | 3 =
    appState === 'intro' ? 1
    : (appState === 'profile' || appState === 'questionnaire') ? 2
    : 3;

  // Sync browser history with appState so Back/Forward work.
  useEffect(() => {
    // On mount, if URL has ?step=... or history state is present, initialize
    const params = new URLSearchParams(window.location.search);
    const step = params.get('step');
    const resultToken = params.get('token');
    if (resultToken) {
      // Email "vedi il tuo risultato" link: always land on results, regardless of session state
      setAppState('results');
      window.history.replaceState({ appState: 'results' }, '', `?step=results&token=${resultToken}`);
    } else if (step) {
      // map known values
      if (step === 'intro' || step === 'profile' || step === 'questionnaire' || step === 'results') {
        setAppState(step as typeof appState);
        // Ensure history reflects the requested step and do not overwrite it with the default
        window.history.replaceState({ appState: step }, '', `?step=${step}`);
      }
    } else {
      // Ensure history has an initial state we can rely on
      window.history.replaceState({ appState }, '', `?step=${appState}`);
    }

    const onPop = (ev: PopStateEvent) => {
      const s = ev.state && ev.state.appState ? ev.state.appState : new URLSearchParams(window.location.search).get('step');
      if (s && (s === 'intro' || s === 'profile' || s === 'questionnaire' || s === 'results')) {
        setAppState(s as typeof appState);
      }
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  // Intentionally run only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push a new history entry whenever appState changes due to navigation
  useEffect(() => {
    window.history.pushState({ appState }, '', `?step=${appState}`);
  }, [appState]);



  return (
    <AppProvider state={appState} setState={setAppState} initialState={appState}>
      <QuestionnaireProvider
      profileId={profileId}
      userRole={userRole}
      onQuestionnaireCompleted={handleQuestionnaireCompleted}
      onRestart={handleRestart}
      onRestartQuestionnaire={handleRestartQuestionnaire}
    >
      <WorkflowShell
        currentStep={shellStep}
        onStart={appState === 'intro' ? () => { setAppState('questionnaire'); setShowProfileForm(false); } : undefined}
        onStepChange={(n) => {
          // map tab number to app state
          if (n === 1) setAppState('intro');
          else if (n === 2) setAppState('profile');
          else if (n === 3) setAppState('questionnaire');
          else setAppState('results');
        }}
        onRequestAuth={(mode) => { setDefaultAuthMode(mode); setShowProfileForm(true); setAppState('profile'); }}
        onSubmitProfile={handleSubmitProfileFromTicket}
      >
        {appState === 'intro' && null}
        {appState === 'profile' && !showProfileForm && null}
        {appState === 'profile' && showProfileForm && <ProfileForm onProfileCreated={handleProfileCreated} defaultMode={defaultAuthMode} />}
        {appState === 'questionnaire' && <Questionnaire />}
        {appState === 'results' && <Results />}
      </WorkflowShell>
      </QuestionnaireProvider>
    </AppProvider>
  );
}

export default App;