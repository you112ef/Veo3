import type { VercelRequest, VercelResponse } from '@vercel/node';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (typeof url !== 'string' || !url) {
    return res.status(400).send('URL query parameter is required.');
  }

  const videoUrl = `${url}&key=${process.env.API_KEY}`;

  try {
    const videoResponse = await fetch(videoUrl);

    if (!videoResponse.ok) {
      const errorBody = await videoResponse.text();
      console.error(`Failed to fetch video. Status: ${videoResponse.status}, Body: ${errorBody}`);
      return res.status(videoResponse.status).send(`Failed to fetch video from source: ${videoResponse.statusText}`);
    }

    res.setHeader('Content-Type', videoResponse.headers.get('content-type') || 'video/mp4');
    res.setHeader('Content-Length', videoResponse.headers.get('content-length') || '');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    if (videoResponse.body) {
      // FIX: Replaced for-await-of loop with a while loop using a reader to manually pump the stream.
      // This resolves the TypeScript error about ReadableStream not having an async iterator in certain Node.js environments.
      const reader = videoResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        res.write(value);
      }
      res.end();
    } else {
       console.error("Upstream response body was null for URL:", url);
       res.status(500).send("Video stream could not be retrieved from the source.");
    }

  } catch (error) {
    console.error('Error proxying video:', error);
    res.status(500).send('Error proxying video.');
  }
}
