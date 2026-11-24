import { Card, CardContent } from '@/components/ui/card';
import { CookiePreferencesButton } from './CookiePreferencesButton';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#142856] px-4 py-6">
      <Card className="mx-auto max-w-[44rem] rounded-[32px] border border-slate-200/80 bg-white/95 py-0 text-base text-slate-900 shadow-[0_16px_60px_rgba(22,14,8,0.08)]">
        <CardContent className="p-5 leading-relaxed sm:p-8 [&_a]:break-words [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_h2]:mb-2 [&_h2]:mt-9 [&_h2]:border-t [&_h2]:border-slate-300 [&_h2]:pt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
  <p><a href="/">Torna alla home</a></p>
  <h1 className="mb-1 font-serif text-3xl font-semibold leading-tight sm:text-4xl">Informativa sulla Privacy</h1>
  <p className="!mb-8 text-sm text-slate-600">Ultimo aggiornamento: 24 novembre 2026</p>

  <p>La presente informativa descrive come vengono trattati i dati personali degli utenti che visitano il sito capadepositi.com (il «Sito») e utilizzano il questionario per la stima degli interessi sul deposito cauzionale, ai sensi del Regolamento (UE) 2016/679 («GDPR») e del D.Lgs. 196/2003 («Codice Privacy»).</p>

  <h2>1. Contitolari del trattamento</h2>
  <p>Il Sito è gestito in autonomia da Tommaso Azzolini e Matteo Boccali, nell’ambito di un progetto accademico svolto presso il Politecnico di Milano. Tommaso Azzolini e Matteo Boccali sono Contitolari del trattamento ai sensi dell’art. 26 GDPR e sono contattabili all’indirizzo email <a href="mailto:capa.depositi@gmail.com">capa.depositi@gmail.com</a>. Il Politecnico di Milano non è titolare né responsabile del trattamento dei dati raccolti tramite il Sito.</p>
  <p>I Contitolari hanno definito con un accordo interno le rispettive responsabilità. In sintesi, entrambi determinano congiuntamente finalità e mezzi del trattamento; l’indirizzo email sopra indicato è il punto di contatto unico per gli utenti, e le richieste ricevute vengono gestite congiuntamente. Il contenuto essenziale dell’accordo è disponibile su richiesta allo stesso indirizzo.</p>

  <h2>2. Dati trattati</h2>
  <ul>
    <li><strong>Dati inseriti nel questionario:</strong> informazioni relative al contratto di locazione e al deposito cauzionale (ad esempio importo del deposito, data di versamento, durata del contratto), necessarie per elaborare la stima.</li>
    <li><strong>Indirizzo email:</strong> se l’utente sceglie di ricevere il risultato del questionario via email.</li>
    <li><strong>Dati di navigazione:</strong> i sistemi informatici che gestiscono il Sito acquisiscono alcuni dati la cui trasmissione è implicita nell’uso dei protocolli Internet (ad esempio indirizzo IP, tipo di browser, data e ora di accesso). Sono usati per garantire il funzionamento e la sicurezza del Sito.</li>
    <li><strong>Cookie e strumenti di tracciamento:</strong> cookie tecnici necessari al funzionamento del Sito e, solo previo consenso dell’utente, cookie di terze parti per la misurazione delle campagne pubblicitarie (vedi punto 7).</li>
  </ul>
  <p>Si invita l’utente a non inserire nel questionario dati personali di terzi o informazioni non richieste.</p>

  <h2>3. Finalità e basi giuridiche</h2>
  <ul>
    <li><strong>Elaborazione della stima e invio del risultato via email:</strong> il trattamento è necessario per fornire il servizio richiesto dall’utente (art. 6, par. 1, lett. b GDPR).</li>
    <li><strong>Risposta a richieste di informazioni:</strong> esecuzione di misure richieste dall’interessato (art. 6, par. 1, lett. b GDPR).</li>
    <li><strong>Sicurezza e funzionamento del Sito:</strong> legittimo interesse dei Contitolari (art. 6, par. 1, lett. f GDPR).</li>
    <li><strong>Misurazione delle conversioni tramite Google Ads:</strong> consenso dell’utente (art. 6, par. 1, lett. a GDPR e art. 122 Codice Privacy), revocabile in qualsiasi momento.</li>
    <li><strong>Analisi a fini di studio accademico:</strong> i dati del questionario possono essere analizzati esclusivamente in forma aggregata e anonima nell’ambito del progetto svolto presso il Politecnico di Milano. Nessun risultato reso noto consentirà di identificare i singoli utenti. Base giuridica: consenso dell’utente, espresso tramite apposita casella nel questionario (art. 6, par. 1, lett. a GDPR).</li>
  </ul>
  <p>I dati non vengono venduti né ceduti a terzi per loro finalità di marketing.</p>

  <h2>4. Modalità del trattamento</h2>
  <p>I dati sono trattati con strumenti informatici, adottando misure tecniche e organizzative adeguate a proteggerli da accessi non autorizzati, perdita o distruzione. I link inviati via email sono protetti da codici univoci memorizzati in forma cifrata.</p>

  <h2>5. Destinatari dei dati</h2>
  <p>I dati possono essere trattati, per conto dei Contitolari e in qualità di responsabili del trattamento, dai seguenti fornitori:</p>
  <ul>
    <li>Vercel Inc., per l’hosting del Sito;</li>
    <li>Resend, per l’invio delle email;</li>
    <li>Cookiebot by Usercentrics, per la gestione del banner e delle preferenze cookie;</li>
    <li>Google Ireland Limited, per i servizi Google Ads, solo previo consenso.</li>
  </ul>
  <p>I docenti e i valutatori del progetto accademico possono ricevere esclusivamente dati aggregati e anonimi, mai dati identificativi.</p>
  <p>I dati possono inoltre essere comunicati alle autorità competenti, ove richiesto dalla legge.</p>

  <h2>6. Trasferimento dei dati fuori dall’UE</h2>
  <p>Alcuni fornitori possono trattare dati negli Stati Uniti. In tali casi il trasferimento avviene sulla base dell’adesione del fornitore all’EU-U.S. Data Privacy Framework o delle Clausole Contrattuali Standard approvate dalla Commissione Europea (art. 46 GDPR).</p>

  <h2>7. Cookie e Google Ads</h2>
  <p>Il Sito utilizza cookie tecnici, che non richiedono consenso. Cookiebot by Usercentrics gestisce il banner e memorizza le preferenze espresse dall’utente. Previo consenso espresso, il Sito utilizza anche il tag di Google Ads, che può installare cookie per misurare l’efficacia delle campagne pubblicitarie. L’utente può modificare o revocare il consenso in qualsiasi momento tramite il link «Preferenze cookie» presente in fondo a ogni pagina.</p>
  <p>Il rifiuto o la revoca del consenso ai cookie non necessari non impedisce l’uso del questionario: i dati forniti vengono trattati per erogare il servizio richiesto e i dati tecnici essenziali possono essere trattati per garantire sicurezza e funzionamento. Se il consenso pubblicitario è negato, Google Ads non può usare i relativi cookie o identificatori. In base alla modalità di Consent Mode configurata, Google può comunque ricevere ping di misurazione senza cookie e con segnali tecnici limitati; nella modalità di base, invece, i tag Google restano bloccati fino al consenso.</p>
  <p>Per informazioni su come Google utilizza i dati: <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">policies.google.com/technologies/partner-sites</a>. L’utente può gestire la personalizzazione degli annunci su <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">adssettings.google.com</a>.</p>

  <h2>8. Periodo di conservazione</h2>
  <ul>
    <li><strong>Dati del questionario e indirizzo email:</strong> fino al termine del progetto, previsto per settembre 2027, e comunque non oltre il 1° gennaio 2028. Successivamente saranno cancellati o resi definitivamente anonimi.</li>
    <li><strong>Richieste di informazioni:</strong> per il tempo necessario a gestirle e comunque non oltre il termine del progetto.</li>
    <li><strong>Dati di navigazione:</strong> per il periodo previsto dal fornitore di hosting (Vercel) per finalità di sicurezza e funzionamento del Sito, salvo necessità di accertamento di illeciti.</li>
    <li><strong>Cookie:</strong> per la durata indicata nel banner dei cookie.</li>
  </ul>

  <h2>9. Diritti dell’utente</h2>
  <p>L’utente può in qualsiasi momento esercitare i diritti previsti dagli artt. 15-22 GDPR: accesso ai propri dati, rettifica, cancellazione, limitazione del trattamento, portabilità, opposizione al trattamento e revoca del consenso (senza pregiudicare la liceità del trattamento effettuato prima della revoca). Le richieste vanno inviate a <a href="mailto:capa.depositi@gmail.com">capa.depositi@gmail.com</a>. Ai sensi dell’art. 26, par. 3 GDPR, l’utente può esercitare i propri diritti nei confronti di ciascuno dei Contitolari.</p>
  <p>L’utente ha inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" rel="noopener noreferrer" target="_blank">www.garanteprivacy.it</a>).</p>

  <h2>10. Natura del conferimento</h2>
  <p>Il conferimento dei dati del questionario è facoltativo, ma senza di essi non è possibile elaborare la stima. Il conferimento dell’email è facoltativo ed è necessario solo per ricevere il risultato via email. Il consenso all’uso dei dati a fini di studio è facoltativo e il suo mancato rilascio non impedisce di utilizzare il questionario.</p>

  <h2>11. Modifiche</h2>
  <p>I Contitolari possono aggiornare la presente informativa. La versione aggiornata sarà pubblicata su questa pagina con la relativa data.</p>
        </CardContent>
      </Card>
      <footer className="mx-auto mt-6 text-center text-sm text-white/80">
        <CookiePreferencesButton className="underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" />
      </footer>
    </main>
  );
}
