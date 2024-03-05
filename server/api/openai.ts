import { getOpenAIResponseWithImage, parseOpenAIResponseContent } from '@/utilities/openai';

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

export default defineEventHandler(async event => {
  if (event.node.req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const body = await readBody(event) as OpenAIPostBody;
  const { imageUrl } = body;
  if (!imageUrl) return new Response("`imageUrl` was not provided", { status: 400 })

  try {
    const response = await getOpenAIResponseWithImage(PROMPT, imageUrl);
    console.log(response);
    return parseOpenAIResponseContent(response.data.choices[0].message.content);
  } catch(error: any) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
});
