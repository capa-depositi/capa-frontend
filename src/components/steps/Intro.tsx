import React from 'react';
import { ArrowRight } from 'lucide-react';

interface IntroProps {
  onStart?: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
  const heroImage = '/circo.jpeg';

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 shadow-[0_20px_70px_rgba(2,8,23,0.5)]">
      <div className="flex flex-col" style={{ backgroundColor: '#142856' }}>
        <img
          src={heroImage}
          alt="Hero"
          className="w-full object-cover"
          style={{ display: 'block', aspectRatio: '3 / 1' }}
        />

        <div className="flex flex-col p-4 sm:p-5 md:p-6 lg:p-8 text-white">
          <div className="mb-1.5 text-xs uppercase tracking-widest font-semibold" style={{ color: '#E8B830' }}>Consulenza immobiliare</div>
          <h1 className="max-w-xl text-xl font-serif font-semibold leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
            Scopri quanto <span className="italic" style={{ color: '#E8B830' }}>remunera</span>
            <br />
            il tuo deposito cauzionale
          </h1>
          <div className="mt-1 uppercase text-xs tracking-wider sm:text-sm" style={{ color: '#7FD1D9' }}>Calcola gli interessi che ti spettano</div>

          <p className="mt-2 max-w-lg text-xs leading-5 text-slate-200 sm:text-sm md:text-base">
            Hai mai ricevuto gli interessi sul tuo deposito cauzionale? L'art. 11 della
            Legge 392/1978 impone al locatore di versarli alla fine di ogni
            anno di locazione. Rispondi a poche domande e scopri l'importo che ti spetta — il biglietto è gratis.
          </p>

          <div className="mt-3 sm:mt-4">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-3 rounded px-6 py-2 text-sm font-semibold bg-transparent hover:bg-[#E8B830] hover:text-blue-900 transition-colors"
              style={{ border: '2px solid #C8920A', color: '#C8920A' }}
            >
              <span className="uppercase tracking-widest">Inizia il calcolo</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 ml-2" />
            </button>
          </div>

          <div
            id="intro-stats"
            className="mt-3 sm:mt-4 w-full grid grid-cols-3"
            style={{ borderTop: '1px solid rgba(201,146,10,0.25)', paddingTop: '8px' }}
          >
            <div className="py-1 px-2 sm:px-4 flex flex-col items-center justify-center text-center" style={{ borderRight: '1px solid rgba(201,146,10,0.15)' }}>
              <div className="text-base sm:text-lg font-bold" style={{ color: '#E8B830' }}>2 min</div>
              <div className="text-[10px] sm:text-xs uppercase text-slate-200">per completare</div>
            </div>
            <div className="py-1 px-2 sm:px-4 flex flex-col items-center justify-center text-center" style={{ borderRight: '1px solid rgba(201,146,10,0.15)' }}>
              <div className="text-base sm:text-lg font-bold" style={{ color: '#E8B830' }}>100%</div>
              <div className="text-[10px] sm:text-xs uppercase text-slate-200">gratuito</div>
            </div>
            <div className="py-1 px-2 sm:px-4 flex flex-col items-center justify-center text-center">
              <div className="text-base sm:text-lg font-bold" style={{ color: '#E8B830' }}>Legge</div>
              <div className="text-[10px] sm:text-xs uppercase text-slate-200">italiana vigente</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;

