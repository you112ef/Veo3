
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
    const { operation } = req.body;

    if (!operation || !operation.name) {
      return res.status(400).json({ error: 'Operation object is required' });
    }
    
    const updatedOperation = await ai.operations.getVideosOperation({ operation });
    
    res.status(200).json(updatedOperation);

  } catch (error: any) {
    console.error("Error checking operation status:", error);
    const errorMessage = error?.message || "An unknown error occurred.";
    res.status(500).json({ error: `Failed to check status: ${errorMessage}` });
  }
}
