
import React, { useState, useRef, useEffect, useCallback } from 'react';

// --- ICONS ---

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 12 12 17 17 12" />
      <line x1="12" y1="17" x2="12" y2="3" />
    </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const VolumeUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const VolumeMutedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);


// --- VIDEO PLAYER COMPONENT ---

interface VideoPlayerProps {
    videoUrl: string;
    index: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, index }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState<string | null>(null);

    const togglePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, []);
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            // Unmute if volume is adjusted while muted
            if (newVolume > 0 && isMuted) {
                setIsMuted(false);
                videoRef.current.muted = false;
            }
        }
    };
    
    const toggleMute = () => {
        if(videoRef.current) {
            const newMutedState = !isMuted;
            setIsMuted(newMutedState);
            videoRef.current.muted = newMutedState;
            // If unmuting and volume is 0, set it to a default
            if (!newMutedState && volume === 0) {
              setVolume(0.5);
              videoRef.current.volume = 0.5;
            }
        }
    };

    const formatDuration = (seconds: number): string => {
        if (isNaN(seconds) || seconds < 0) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleMetadataLoaded = () => {
        if (videoRef.current) {
            setDuration(formatDuration(videoRef.current.duration));
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            if(video) {
              video.currentTime = 0;
            }
        };
        
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        // Set initial muted state
        video.muted = isMuted;

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, [isMuted]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `veo-generated-video-${index + 1}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-fade-in border border-gray-700 flex flex-col justify-between group">
            <div className="relative cursor-pointer" onClick={togglePlayPause}>
                <video
                    ref={videoRef}
                    src={videoUrl}
                    onLoadedMetadata={handleMetadataLoaded}
                    className="w-full h-auto object-cover"
                />
                
                <div className={`absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'bg-opacity-40 opacity-100'}`}>
                    {!isPlaying && (
                         <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform transition-transform group-hover:scale-110">
                            <PlayIcon className="h-12 w-12 text-white" />
                         </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-600/50">
                    <div className="h-full bg-brand-purple transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="p-4 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                    <button onClick={togglePlayPause} aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'} className="text-white hover:text-gray-300 transition-colors">
                        {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                    </button>
                    <div className="flex items-center gap-2 group">
                        <button 
                            onClick={toggleMute} 
                            aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'} 
                            className="relative group text-white hover:text-gray-300 transition-colors"
                        >
                            {isMuted || volume === 0 ? <VolumeMutedIcon className="h-6 w-6" /> : <VolumeUpIcon className="h-6 w-6" />}
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black bg-opacity-75 text-white text-xs font-semibold rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {isMuted || volume === 0 ? 'إلغاء الكتم' : 'كتم'}
                            </span>
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-0 opacity-0 group-hover:w-24 group-hover:opacity-100 transition-all duration-300 ease-in-out h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                            aria-label="التحكم في مستوى الصوت"
                        />
                    </div>
                </div>
                {duration && (
                  <span className="text-sm font-mono text-gray-400 select-none">{duration}</span>
                )}
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600/80 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-200"
                    aria-label={`تحميل الفيديو ${index + 1}`}
                >
                    <DownloadIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">تحميل</span>
                </button>
            </div>
        </div>
    );
};


// --- MAIN GRID COMPONENT ---

interface VideoGridProps {
  videos: string[];
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">الفيديوهات التي تم إنشاؤها</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((videoUrl, index) => (
          <VideoPlayer key={index} videoUrl={videoUrl} index={index} />
        ))}
      </div>
    </section>
  );
};
