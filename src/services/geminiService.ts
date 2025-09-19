import type { VideoQuality } from '../App';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'error' in error) {
      const errObj = error as { error: string | { message: string } };
      if (typeof errObj.error === 'object' && errObj.error !== null && 'message' in errObj.error) {
          return errObj.error.message;
      }
      if(typeof errObj.error === 'string') {
          return errObj.error;
      }
  }
  if (typeof error === 'string') {
    return error;
  }
  return "حدث خطأ غير معروف.";
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

export const generateAndPollVideos = async (
    prompt: string, 
    imageFile: File | null, 
    setLoadingMessage: (message: string) => void,
    quality: VideoQuality
): Promise<string[]> => {
    try {
        setLoadingMessage("...جاري تهيئة عملية إنشاء الفيديو");

        let imagePayload = null;
        if (imageFile) {
            setLoadingMessage("...جاري تشفير الصورة للإنشاء");
            imagePayload = await fileToBase64(imageFile);
        }

        setLoadingMessage("...إرسال الطلب إلى الخادم");
        const startResponse = await fetch('/api/start-generation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, image: imagePayload, quality }),
        });

        if (!startResponse.ok) {
            const errorData = await startResponse.json();
            throw new Error(getErrorMessage(errorData));
        }

        let operation = await startResponse.json();

        // Polling logic
        while (!operation.done) {
            setLoadingMessage("...جاري معالجة الفيديو، قد يستغرق هذا بضع دقائق");
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            
            const statusResponse = await fetch('/api/check-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operation }),
            });

            if (!statusResponse.ok) {
                const errorData = await statusResponse.json();
                throw new Error(`فشل التحقق من حالة الإنشاء: ${getErrorMessage(errorData)}`);
            }
            
            operation = await statusResponse.json();
        }

        // Check for errors in the final operation result
        if (operation.error) {
            console.error("Video generation operation failed:", operation.error);
            throw new Error(getErrorMessage(operation.error));
        }

        const response = operation.response;

        if (response?.promptFeedback?.blockReason) {
             throw new Error(`تم حظر إنشاء الفيديو لأسباب تتعلق بالسلامة (${response.promptFeedback.blockReason}). الرجاء تجربة وصف مختلف.`);
        }
        
        if (!response?.generatedVideos || response.generatedVideos.length === 0) {
            throw new Error("اكتمل إنشاء الفيديو، ولكن لم يتم إرجاع أي فيديوهات.");
        }
        
        setLoadingMessage("...تم إنشاء الفيديوهات بنجاح");
        
        // Return proxied URLs
        const videoUrls = response.generatedVideos
            .map((videoData: any) => {
                const downloadLink = videoData?.video?.uri;
                if (!downloadLink) {
                    console.warn('A generated video in the response is missing a download URI.');
                    return null;
                }
                return `/api/fetch-video?url=${encodeURIComponent(downloadLink)}`;
            })
            .filter((url: string | null): url is string => url !== null);

        if (videoUrls.length === 0) {
            throw new Error("تم إنشاء بيانات الفيديو الوصفية، لكن فشل الحصول على روابط الفيديو النهائية.");
        }
        
        return videoUrls;

    } catch (error) {
        console.error("Error in generateAndPollVideos:", error);
        throw new Error(`فشل إنشاء الفيديو: ${getErrorMessage(error)}`);
    }
};
