import React, { useState, useRef } from 'react';
import type { VideoQuality } from '../App';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  setImageFile: (file: File | null) => void;
  quality: VideoQuality;
  setQuality: (quality: VideoQuality) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);


export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, setImageFile, quality, setQuality, onSubmit, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_PROMPT_LENGTH = 400;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }
  
  const counterColor =
    prompt.length > MAX_PROMPT_LENGTH
        ? 'text-red-400'
        : prompt.length > MAX_PROMPT_LENGTH * 0.9
        ? 'text-yellow-400'
        : 'text-gray-500';


  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-900/50 rounded-2xl p-6 shadow-2xl border border-white/10 backdrop-blur-xl">
      <div className="flex flex-col gap-5">
        <div className="relative w-full">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: أسد مهيب يزأر على جرف صخري عند غروب الشمس..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-lg p-4 pr-6 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition duration-200 resize-none h-32"
              disabled={isLoading}
              maxLength={MAX_PROMPT_LENGTH + 50} // Allow some overflow
            />
            <div className="absolute bottom-3 left-3 text-xs font-mono select-none pointer-events-none">
                <span className={counterColor}>{prompt.length}</span>
                <span className="text-gray-500"> / {MAX_PROMPT_LENGTH}</span>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
                <div className="flex items-center justify-center gap-2 bg-gray-800/60 p-2 rounded-lg border border-white/10 w-full sm:w-auto">
                    <span className="text-sm font-medium text-gray-400">الجودة:</span>
                    <button 
                        onClick={() => setQuality('standard')}
                        disabled={isLoading}
                        className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${quality === 'standard' ? 'bg-brand-blue text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-white/5'}`}
                    >
                        عادي
                    </button>
                    <button 
                        onClick={() => setQuality('hd')}
                        disabled={isLoading}
                        className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${quality === 'hd' ? 'bg-brand-blue text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-white/5'}`}
                    >
                        عالي الدقة
                    </button>
                </div>
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex-grow justify-center items-center gap-2 px-4 py-2 bg-gray-800/60 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex"
                  >
                    <UploadIcon className="h-5 w-5" />
                    {imagePreview ? 'تغيير الصورة' : 'إضافة صورة'}
                  </button>
            </div>
          
            <button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-full md:w-auto group relative flex justify-center items-center gap-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-brand-purple/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait disabled:animate-pulse-subtle"
            >
                <SparklesIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                {isLoading ? '...جاري الإنشاء' : 'إنشاء الفيديو'}
            </button>
        </div>
        
        {imagePreview && (
          <div className="mt-2 relative animate-fade-in w-fit mx-auto">
            <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg shadow-md border-2 border-white/10" />
             <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold hover:bg-red-700 transition-transform hover:scale-110"
                aria-label="إزالة الصورة"
            >
                &times;
            </button>
          </div>
        )}
         <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            disabled={isLoading}
          />
      </div>
    </div>
  );
};
