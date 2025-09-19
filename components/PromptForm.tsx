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
        ? 'text-red-500'
        : prompt.length > MAX_PROMPT_LENGTH * 0.9
        ? 'text-yellow-400'
        : 'text-gray-400';


  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/50 rounded-2xl p-6 shadow-2xl border border-gray-700 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: أسد مهيب يزأر على جرف صخري عند غروب الشمس"
              className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition duration-200 resize-none h-28 pl-20"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 left-3 text-xs font-mono select-none pointer-events-none">
                <span className="text-gray-500">{MAX_PROMPT_LENGTH} / </span>
                <span className={counterColor}>{prompt.length}</span>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">الجودة:</span>
                <button 
                    onClick={() => setQuality('standard')}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${quality === 'standard' ? 'bg-brand-blue text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    عادي
                </button>
                <button 
                    onClick={() => setQuality('hd')}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${quality === 'hd' ? 'bg-brand-blue text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    عالي الدقة
                </button>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            disabled={isLoading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full sm:w-auto flex-grow justify-center items-center gap-2 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex"
          >
            <UploadIcon className="h-5 w-5" />
            إضافة صورة (اختياري)
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto flex-grow bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold py-2 px-6 rounded-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-wait flex justify-center items-center gap-2"
          >
             <SparklesIcon className="h-5 w-5" />
            {isLoading ? '...جاري الإنشاء' : 'إنشاء الفيديوهات'}
          </button>
        </div>
        {imagePreview && (
          <div className="mt-4 relative animate-fade-in">
            <p className="text-sm text-gray-400 mb-2">معاينة الصورة:</p>
            <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg mx-auto" />
             <button
                onClick={handleRemoveImage}
                className="absolute top-0 left-0 -mt-2 -ml-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition"
                aria-label="إزالة الصورة"
            >
                &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};