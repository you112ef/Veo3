
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, image, quality } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let generateVideosParams: any = {
      model: 'veo-2.0-generate-001',
      prompt,
      config: {
        numberOfVideos: 2,
        quality: quality || 'standard'
      }
    };

    if (image && image.data && image.mimeType) {
      generateVideosParams.image = {
        imageBytes: image.data,
        mimeType: image.mimeType
      };
    }
    
    const operation = await ai.models.generateVideos(generateVideosParams);
    
    // Return the initial operation object to the client for polling
    res.status(202).json(operation);

  } catch (error: any) {
    console.error("Error starting video generation:", error);
    const errorMessage = error?.message || "An unknown error occurred.";
    res.status(500).json({ error: `Failed to start video generation: ${errorMessage}` });
  }
}
