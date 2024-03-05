import { getOpenAIResponseWithImage, getUrlFromOpenAIContent, parseOpenAIContent } from '@/utilities/openai';
import { validateImage } from '@/utilities/files';

// POST expects the following body
type OpenAIPostBody = {
  imageUrl: string;
};

// key is readable term for openai, value corresponding url param
const params = {
  year: 'year',
  type: 'type',
  make: 'make',
  model: 'model',
  trim: 'trim',
};

const PROMPT = `the attached image should be an RV or trailer home. as a JSON response only, approximate its ${Object.keys(params).map(param => param).join(', ')}. make guesses, no unspecified values. If you do not find an RV/trailer in the image, return status of error with a readable error message. additionally include a "confidence" score from 0 to 10 and approximate how accurate the guess is. so JSON response must be: {status: 'ok' | 'error', statusText, data: {...the aforementioned fields, confidence}}`;

type VehicleVisionResponse = {
  status: string;
  statusText: string;
  data: {
    year: string;
    type: string;
    make: string;
    model: string;
    trim: string;
    url: string;
  }
}

export default defineEventHandler(async event => {
  if (event.node.req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const body = await readBody(event) as OpenAIPostBody;
  const { imageUrl } = body;
  if (!imageUrl) return new Response("`imageUrl` was not provided", { status: 400 })

  const imageValidation = validateImage(imageUrl)
  if (!imageValidation.isValid) return new Response(imageValidation.message, { status: 400 });

  try {
    const response = await getOpenAIResponseWithImage(PROMPT, imageUrl);
    const content = parseOpenAIContent(response.data.choices[0].message.content);
    return {
      status: content.status,
      statusText: content.statusText,
      data: {
        ...content.data,
        url: getUrlFromOpenAIContent(content),
      },
    } as VehicleVisionResponse;
  } catch(error: any) {
    return new Response(error, { status: 500 });
  }
});
