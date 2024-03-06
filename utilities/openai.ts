import axios from 'axios';
import type { OpenAIVisionRequestBody, OpenAIVisionResponseContent } from '@/types/openai';

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export const parseOpenAIContent = (str: string): OpenAIVisionResponseContent => {
  str = str.replace(/^```json\s*|```$/g, '');
  const obj = JSON.parse(str);

  return obj;
}

export const getOpenAIResponseWithImage = async (prompt: string, imageUrl: string) => {
  const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
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
  const vehicleTypes = {
    "RV/Trailer Home": "rvtrader",
    "Motorcycle": "cycletrader",
    "Car": "carsales",
  }
  const params = {
    make: 'make',
    model: 'model',
  };
  const overview = "Analyze the attached image and respond in JSON only. The response should be of shape: { status: 'ok' | 'error'; statusText: string; data: { ...the attributes defined in a moment } }";
  const expectedImage = `The attached image should be of a vehicle. If vehicle is detected, use the following mapping for the value of \`website\` where the key is vehicle type and the value is its corresponding website: ${JSON.stringify(vehicleTypes)}. If none of these vehicle types are detected throw an error.`;
  const responseFormat = `Approximate the following attributes: ${Object.keys(params).map(param => param).join(', ')}. Return each these as fields. If some but not all of these attributes are detected, return null for the unknown values. If none of these are detected throw an error.`;
  const noUnspecified = `Make guesses, no unspecified values. Guesses should never be "N/A" or any other indeterminate value.`;
  const errorCase = "If an error is thrown for any reason, return status of error with a readable error message as `statusText`.";

  return [
    overview,
    expectedImage,
    responseFormat,
    noUnspecified,
    errorCase,
  ].join('\n');
}
