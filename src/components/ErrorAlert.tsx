import React from 'react';

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="my-8 w-full max-w-3xl mx-auto bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded-xl relative animate-fade-in shadow-lg backdrop-blur-sm animate-shake" role="alert">
      <div className="flex items-start">
        <div className="pt-1">
          <AlertTriangleIcon className="h-6 w-6 text-red-400 ml-4" />
        </div>
        <div>
          <strong className="font-bold block text-lg text-red-300">حدث خطأ</strong>
          <span className="block mt-1">{message}</span>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="absolute top-2 right-auto left-2 p-2 rounded-full hover:bg-white/10"
        aria-label="إغلاق"
      >
        <span className="text-2xl text-red-300 hover:text-white transition-colors">&times;</span>
      </button>
    </div>
  );
};