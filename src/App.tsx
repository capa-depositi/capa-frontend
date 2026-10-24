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
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [questionnaireKey, setQuestionnaireKey] = useState(0);
  const [userRole, setUserRole] = useState<'affittuario' | null>(null);
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);
  const [defaultAuthMode, setDefaultAuthMode] = useState<'signup' | 'signin'>('signup');

  const createSubmission = async (id: string) => {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: id })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Errore durante la creazione del questionario');
    return data.submissionId as string;
  };

  const handleProfileCreated = async (id: string) => {
    setProfileId(id);
    setSubmissionId(null);
    setQuestionnaireKey(current => current + 1);
    setUserRole('affittuario');
    setAppState('questionnaire');
  };

  const handleSubmitProfileFromTicket = async (data: { nome: string; cognome: string; email: string; eta: number }) => {
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, eta: data.eta || undefined, ruolo: 'affittuario' })
    });
    const profile = await response.json();
    if (!response.ok) throw new Error(profile.error || 'Errore durante la creazione del profilo');

    const newSubmissionId = await createSubmission(profile.profileId);
    setProfileId(profile.profileId);
    setSubmissionId(newSubmissionId);
    setUserRole('affittuario');
  };

  const handleQuestionnaireCompleted = async (answers?: Record<string, string>) => {
    let activeSubmissionId = submissionId;
    if (!profileId || !activeSubmissionId) {
      const email = answers?.ticket_email;
      const response = await fetch('/api/profiles', {
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
      const profile = await response.json();
      if (!response.ok) throw new Error(profile.error || 'Errore durante la creazione del profilo');

      setProfileId(profile.profileId);
      setUserRole('affittuario');
      activeSubmissionId = await createSubmission(profile.profileId);
      setSubmissionId(activeSubmissionId);

      for (const [questionId, value] of Object.entries(answers || {})) {
        if (questionId.startsWith('ticket_')) continue;
        const answerResponse = await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId: activeSubmissionId, questionId, value })
        });
        if (!answerResponse.ok) throw new Error(`Errore durante il salvataggio della risposta ${questionId}`);
      }
    }

    if (!activeSubmissionId) throw new Error('Submission non disponibile');
    const completionResponse = await fetch(`/api/submissions/${activeSubmissionId}/complete`, { method: 'POST' });
    const completion = await completionResponse.json();
    if (!completionResponse.ok) throw new Error(completion.error || 'Errore durante il completamento');
    setAppState('results');
  };

  const handleRestart = () => {
    setAppState('intro');
    setProfileId(null);
    setSubmissionId(null);
    setUserRole(null);
    window.history.replaceState({ appState: 'intro' }, '', '?step=intro');
  };

  const handleRestartQuestionnaire = async () => {
    setSubmissionId(null);
    setQuestionnaireKey(current => current + 1);
    window.history.replaceState({ appState: 'questionnaire' }, '', '?step=questionnaire');
    setAppState('questionnaire');
  };

  const handleStartQuestionnaire = () => {
    setSubmissionId(null);
    setQuestionnaireKey(current => current + 1);
    window.history.replaceState({ appState: 'questionnaire' }, '', '?step=questionnaire');
    setAppState('questionnaire');
    setShowProfileForm(false);
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
    const token = appState === 'results' ? new URLSearchParams(window.location.search).get('token') : null;
    const query = new URLSearchParams({ step: appState });
    if (token) query.set('token', token);
    window.history.pushState({ appState }, '', `?${query.toString()}`);
  }, [appState]);



  return (
    <AppProvider state={appState} setState={setAppState} initialState={appState}>
      <QuestionnaireProvider
      key={questionnaireKey}
      profileId={profileId}
      submissionId={submissionId}
      userRole={userRole}
      onQuestionnaireCompleted={handleQuestionnaireCompleted}
      onRestart={handleRestart}
      onRestartQuestionnaire={handleRestartQuestionnaire}
    >
      <WorkflowShell
        currentStep={shellStep}
        onStart={appState === 'intro' ? handleStartQuestionnaire : undefined}
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
        {appState === 'questionnaire' && <Questionnaire onSubmitProfile={handleSubmitProfileFromTicket} />}
        {appState === 'results' && <Results />}
      </WorkflowShell>
      </QuestionnaireProvider>
    </AppProvider>
  );
}

export default App;