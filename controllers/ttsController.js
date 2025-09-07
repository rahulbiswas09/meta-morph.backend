import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { asyncHandler } from "@libs/middlewares.js";

export const generateTTS = asyncHandler(async (req, res) => {
    const { text } = req.query;

    const eleven = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audioStream  = await eleven.textToSpeech.convert('JNaMjd7t4u3EhgkVknn3', {
      text,
      modelId: 'eleven_flash_v2_5'
    });

     // Collect the stream into a buffer
  const chunks = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }
  const audioBuffer = Buffer.concat(chunks);

  res.setHeader("Content-Type", "audio/mpeg");
  res.send(audioBuffer);   // send raw audio, not JSON
// console.log(audio)
    // res.setHeader("Content-Type", "audio/mpeg");
    // res.json({ success: true, data: audio });
})