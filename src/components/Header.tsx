import React, { useState, useEffect } from 'react';

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

const getGradientForTimeOfDay = (): string => {
  const hour = new Date().getHours();

  // Morning (5am - 11am): Bright, sunny colors
  if (hour >= 5 && hour < 12) {
    return 'from-yellow-300 via-orange-400 to-sky-400';
  }
  // Afternoon (12pm - 5pm): Clear, blue sky colors
  if (hour >= 12 && hour < 17) {
    return 'from-sky-400 via-cyan-300 to-blue-500';
  }
  // Evening (5pm - 9pm): Sunset colors
  if (hour >= 17 && hour < 21) {
    return 'from-orange-500 via-red-500 to-purple-600';
  }
  // Night (9pm - 5am): Deep, night sky colors
  return 'from-indigo-400 via-purple-500 to-gray-400';
};


export const Header: React.FC = () => {
  const [gradientClasses, setGradientClasses] = useState('');

  useEffect(() => {
    setGradientClasses(getGradientForTimeOfDay());
  }, []);

  return (
    <header className="text-center py-6 animate-text-focus-in">
      <div className="flex items-center justify-center gap-4 mb-4">
        <FilmReelIcon className="h-10 w-10 text-brand-purple" />
        <h1 className={`
          text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight 
          bg-gradient-to-r text-transparent bg-clip-text
          bg-[size:200%_auto] animate-background-pan
          transition-all duration-1000 ease-in-out
          ${gradientClasses || 'from-purple-400 via-pink-500 to-blue-500'}
        `}>
          مولد فيديوهات VEO
        </h1>
      </div>
      <p className="max-w-3xl mx-auto text-lg text-gray-400">
        أطلق العنان لخيالك. قم بإنشاء فيديوهات مذهلة وعالية الدقة من وصف نصي بسيط باستخدام نموذج VEO المتطور من Google.
      </p>
    </header>
  );
};