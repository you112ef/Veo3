import React, { useState, useCallback, useEffect } from 'react';
import { PromptForm } from './components/PromptForm';
import { VideoGrid } from './components/VideoGrid';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { ErrorAlert } from './components/ErrorAlert';
import { generateAndPollVideos } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';
// FIX: Import the EmptyState component to be used when no videos are present.
import { EmptyState } from './components/EmptyState';

export type VideoQuality = 'standard' | 'hd';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<VideoQuality>('standard');

  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0;
      const interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('الرجاء إدخال وصف لإنشاء الفيديو.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVideos([]); // Clear previous videos for a new request
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const videoUrls = await generateAndPollVideos(prompt, imageFile, setLoadingMessage, quality);
      setGeneratedVideos(videoUrls);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, imageFile, quality]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <main className="container mx-auto px-4 py-8">
        <Header />

        <section className="my-10 animate-fade-in">
          <PromptForm
            prompt={prompt}
            setPrompt={setPrompt}
            setImageFile={setImageFile}
            quality={quality}
            setQuality={setQuality}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
        </section>

        {isLoading && <Loader message={loadingMessage} />}

        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {/* FIX: Conditionally render VideoGrid or EmptyState for better UX. */}
        <VideoGrid videos={generatedVideos} />
        {!isLoading && !error && generatedVideos.length === 0 && <EmptyState />}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>مدعوم بواسطة VEO من Google. تم إنشاؤه باستخدام React و Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
