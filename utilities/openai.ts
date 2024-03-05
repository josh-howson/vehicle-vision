import axios from 'axios';
import type { OpenAIVisionRequestBody, OpenAIVisionResponseContent } from '@/types/openai';

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const parseOpenAIContent = (str: string): OpenAIVisionResponseContent => {
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
              detail: "low",
            }
          }
        ],
      }
    ],
    max_tokens: 300,
  };

  return await axios.post(OPENAI_URL, payload, { headers })
}

export const getUrlFromOpenAIContent = (content: OpenAIVisionResponseContent) => {
  if (content.status !== 'ok') return undefined;
  const base = "https://www.rvtrader.com/rvs-for-sale";
  const params = new URLSearchParams();

  Object.entries(content.data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  return `${base}?${params.toString()}`;
}

export const buildPrompt = () => {
  const params = {
    make: 'make',
    model: 'model',
  };
  const vehicleType = "an RV or Trailer home";
  const expectedImage = `The attached image should be ${vehicleType}.`;
  const responseFormat = `As a JSON Response only, approximate the following attributes: ${Object.keys(params).map(param => param).join(', ')}.`;
  const noUnspecified = `Make guesses, no unspecified values. Always make a real guess, never "N/A" or other uncertain values.`;
  const errorCase = "If you do not find a matching vehicle, or if you're unable to detect which kind of vehicle it, is return status of error with a readable error message as `statusText`.";
  const TSType = "{ status: 'ok' | 'error'; statusText: string; data: { ...the aforementioned attributes } }";
  const respondWithType = `The response should be of shape: ${TSType}`;

  return [
    expectedImage,
    responseFormat,
    noUnspecified,
    errorCase,
    respondWithType,
  ].join(' ');
}
