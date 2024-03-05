import axios from 'axios';
import type { OpenAIVisionRequestBody, OpenAIVisionResponseContent } from '@/types/openai';

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const parseOpenAIResponseContent = (str: string): OpenAIVisionResponseContent => {
  str = str.replace(/^```json\s*|```$/g, '');
  const obj = JSON.parse(str);

  return obj;
}

export const getOpenAIResponseWithImage = async (prompt: string, imageUrl: string) => {
  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };

  const payload: OpenAIVisionRequestBody = {
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            }
          }
        ],
      }
    ],
    max_tokens: 300,
  };

  return await axios.post(OPENAI_URL, payload, { headers })
}