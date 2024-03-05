import { getOpenAIResponseWithImage, parseOpenAIResponseToObject } from '@/utilities/openai';

type OpenAIPostBody = {
  imageUrl: string;
};

const PROMPT = "the attached image should be an RV or trailer home. as a JSON response only, approximate its year, make, model, class, floorplan, category, length, fuel type, sleeping capacity, gross vehicle weight. make guesses, no unspecified values. If you do not find an RV/trailer in the image, return status of error with a readable error message. so JSON response must be: {status, statusText, data: {...the aforementioned fields}}";

export default defineEventHandler(async event => {
  if (event.node.req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const body = await readBody(event) as OpenAIPostBody;
  const { imageUrl } = body;
  if (!imageUrl) return new Response("`imageUrl` was not provided", { status: 400 })

  try {
    const response = await getOpenAIResponseWithImage(PROMPT, imageUrl);
    return parseOpenAIResponseToObject(response.data.choices[0].message.content) as string;
  } catch(error: any) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
});
