import React from 'react';

const FilmReelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="text-center py-6 animate-text-focus-in">
      <div className="flex items-center justify-center gap-4 mb-4">
        <FilmReelIcon className="h-10 w-10 text-brand-purple" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
          مولد فيديوهات VEO
        </h1>
      </div>
      <p className="max-w-3xl mx-auto text-lg text-gray-400">
        أطلق العنان لخيالك. قم بإنشاء فيديوهات مذهلة وعالية الدقة من وصف نصي بسيط باستخدام نموذج VEO المتطور من Google.
      </p>
    </header>
  );
};