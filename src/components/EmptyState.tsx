import React from 'react';

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center my-12 animate-fade-in">
      <div className="inline-block bg-gray-800/60 p-6 rounded-full border border-white/10">
        <VideoIcon className="h-16 w-16 text-brand-purple" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">ابدأ رحلتك الإبداعية</h3>
      <p className="mt-2 text-lg text-gray-400 max-w-md mx-auto">
        أدخل وصفًا أعلاه، وأضف صورة إذا أردت، ودع نموذج VEO يحول أفكارك إلى فيديوهات.
      </p>
    </div>
  );
};
