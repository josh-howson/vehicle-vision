import { buildPrompt, getOpenAIResponseWithImage, getUrlFromOpenAIContent, parseOpenAIContent } from '@/utilities/openai';
import { validateImage } from '@/utilities/files';

// POST expects the following body
type OpenAIPostBody = {
  imageUrl: string;
};

const PROMPT = buildPrompt();

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
