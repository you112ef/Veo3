import { GoogleGenAI } from "@google/genai";
import type { VideoQuality } from '../App';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts a user-friendly error message from various error formats.
 * @param error The error object, which can be of any type.
 * @returns A string containing the most specific error message available.
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Sometimes the message itself is a JSON string from the API
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
    } catch (e) {
      // Not a JSON string, return the original message
      return error.message;
    }
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    // Handle cases where the error object is from the API directly
    if ('message' in error && typeof (error as any).message === 'string') {
      return (error as any).message;
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  return "حدث خطأ غير معروف أثناء العملية.";
};


const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

const pollOperation = async <T,>(operation: any, setLoadingMessage: (message: string) => void): Promise<T> => {
    let currentOperation = operation;
    while (!currentOperation.done) {
        setLoadingMessage("...جاري معالجة الفيديو، قد يستغرق هذا بضع دقائق");
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
        } catch (error) {
            console.error("Error during polling:", error);
            throw new Error("فشل أثناء التحقق من حالة إنشاء الفيديو.");
        }
    }

    if (currentOperation.error) {
        const errorMessage = getErrorMessage(currentOperation.error);
        console.error("Video generation operation failed with an error:", currentOperation.error);
        throw new Error(errorMessage);
    }

    return currentOperation.response as T;
};

export const generateAndPollVideos = async (
    prompt: string, 
    imageFile: File | null, 
    setLoadingMessage: (message: string) => void,
    quality: VideoQuality
): Promise<string[]> => {
    
    try {
        setLoadingMessage("...جاري تهيئة عملية إنشاء الفيديو");

        let generateVideosParams: any = {
            model: 'veo-2.0-generate-001',
            prompt,
            config: {
                numberOfVideos: 2,
                quality: quality // Add the quality parameter
            }
        };
        
        if (imageFile) {
            setLoadingMessage("...جاري تشفير الصورة للإنشاء");
            const { mimeType, data } = await fileToBase64(imageFile);
            generateVideosParams.image = {
                imageBytes: data,
                mimeType: mimeType
            };
        }
        
        setLoadingMessage("...إرسال الطلب إلى نموذج VEO");
        let operation = await ai.models.generateVideos(generateVideosParams);

        const response = await pollOperation<any>(operation, setLoadingMessage);
        
        if (response?.promptFeedback?.blockReason) {
             throw new Error(`تم حظر إنشاء الفيديو لأسباب تتعلق بالسلامة (${response.promptFeedback.blockReason}). الرجاء تجربة وصف مختلف.`);
        }

        if (!response?.generatedVideos || response.generatedVideos.length === 0) {
            throw new Error("اكتمل إنشاء الفيديو، ولكن لم يتم إرجاع أي فيديوهات. قد يكون الوصف معقدًا جدًا أو لم يتمكن النموذج من معالجته.");
        }
        
        setLoadingMessage("...جاري تحميل الفيديوهات التي تم إنشاؤها");
        const videoUrlPromises = response.generatedVideos.map(async (videoData: any) => {
            const downloadLink = videoData?.video?.uri;
            if (!downloadLink) {
                console.warn('A generated video in the response is missing a download URI.');
                return null;
            }
            try {
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                if (!videoResponse.ok) {
                    console.error(`Failed to download video from ${downloadLink}. Status: ${videoResponse.statusText}`);
                    return null;
                }
                const blob = await videoResponse.blob();
                return URL.createObjectURL(blob);
            } catch (downloadError) {
                console.error(`An error occurred while trying to download from ${downloadLink}`, downloadError);
                return null;
            }
        });
        
        const videoUrls = (await Promise.all(videoUrlPromises)).filter((url): url is string => url !== null);

        if (videoUrls.length === 0) {
            throw new Error("تم إنشاء بيانات الفيديو الوصفية، لكن فشل تحميل ملفات الفيديو النهائية.");
        }
        
        return videoUrls;

    } catch (error) {
        console.error("Error in generateAndPollVideos:", error);
        const errorMessage = getErrorMessage(error);
        throw new Error(`فشل إنشاء الفيديو: ${errorMessage}`);
    }
};