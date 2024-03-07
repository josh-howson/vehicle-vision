import type { WebsiteId } from "./website";

type OpenAIContentText = {
  type: 'text';
  text: string;
};

type OpenAIContentImageURL = {
  type: 'image_url';
  image_url: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  }
};

type OpenAIContent = OpenAIContentText | OpenAIContentImageURL;

export type OpenAIVisionRequestBody = {
  model: string,
  messages: {
    role: "user";
    content: OpenAIContent[];
  }[];
  max_tokens: number;
};

export type OpenAIVisionResponseContent = {
  status: 'error' | 'ok';
  statusText: string;
  data: {
    make: string;
    model: string;
    website: WebsiteId;
    url: string;
  }
}