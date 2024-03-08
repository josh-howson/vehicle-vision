import axios from 'axios';
import type { OpenAIVisionRequestBody, OpenAIVisionResponseContent } from '@/types/openai';
import type { WebsiteId } from '~/types/website';

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
  const BASE_URL = {
    rvtrader: "https://www.rvtrader.com",
    cycletrader: "https://www.cycletrader.com",
    carsales: "https://www.carsales.com.au"
  };
  const base = BASE_URL[content.data.website];
  if (!base) return undefined;
  const params = new URLSearchParams();

  if (['rvtrader', 'cycletrader'].includes(content.data.website)) {
    let srpLine = ''
    if (content.data.website === 'rvtrader') srpLine = '/rvs-for-sale';
    if (content.data.website === 'cycletrader') srpLine = '/motorcycles-for-sale';
    if (content.data.make) params.append('make', content.data.make);
    if (content.data.model) params.append('model', content.data.model);
    return `${base}${srpLine}?${params.toString()}`;
  }

  if (content.data.website === 'carsales') {
    return [base, content.data.make, content.data.model, ""].filter(i => !!i).join('/');
  }
}

export const buildPrompt = () => {
  const vehicleTypes: {[key: string]: WebsiteId} = {
    "RV/Trailer home": "rvtrader",
    "motorcycle": "cycletrader",
    "car": "carsales",
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
  const undetectedErrorInstruction = "If a type of vehicle not specified in the mapping appears, please use `statusText` to, in one short sentence, inform them of the type of vehicle they photographed, and that this type of vehicle is not supported, and list the allowed vehicle types.";
  const rightButVehicleBadImageError = "If the image appears to be one of the supported vehicle types, but you weren't able to lock down a make/model for it, use `statusText` give the user a couple brief pointers on how they could photograph the vehicle to better help you analyze it.";
  const statusTextTone = "The tone of `statusText` should be slightly casual, polite, brief but not short, and never exceeding 3 sentences, and prioritize helping the user help you (only when status=error).";

  return [
    overview,
    expectedImage,
    responseFormat,
    noUnspecified,
    errorCase,
    undetectedErrorInstruction,
    rightButVehicleBadImageError,
    statusTextTone,
  ].join('\n');
}
