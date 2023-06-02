import { ChatCompletionRequestMessage, Configuration, CreateImageRequest, OpenAIApi } from 'openai';
import { get } from 'lodash';
import { IApiRespone, IUsage } from '../types';
import pricing from './pricing.openAI.json';
import bytes from 'bytes';
import { sortBy } from '../utils/sort';

export let instance: OpenAIApi;

export const init = (apiKey: string, organization?: string) => {
  const configuration = new Configuration({
    organization,
    apiKey,
  });

  instance = new OpenAIApi(configuration);
};

export const getModels = async () => {
  let response;

  try {
    response = await instance.listModels();
  } catch (err) {
    throw err;
  }

  return response.data;
};

export const chatCompletion = async (
  messages: ChatCompletionRequestMessage[],
  model: string = 'gpt-3.5-turbo'
) => {
  let response;

  try {
    response = await instance.createChatCompletion({
      model,
      messages,
    });
  } catch (err) {
    throw err;
  }

  return response.data;
};

export const completion = async (prompt: string, model: string) => {
  let response;

  try {
    response = await instance.createCompletion({
      model,
      prompt,
    });
  } catch (err) {
    throw err;
  }

  return response.data;
};

export const image = async (request: CreateImageRequest) => {
  let response;

  try {
    response = await instance.createImage(request);
    console.log('response ->', response);
  } catch (err) {
    throw err;
  }

  return response.data;
};

export const parseResponse = (response: any): IApiRespone => {
  return {
    responseId: response.id,
    content: get(response, 'choices[0].message.content', ''),
    usage: response.usage,
    price: calculatePrice(response),
    isSuccess: true,
  };
};

export const calculatePrice = (response: any) => {
  const { usage, model } = response;

  const { prompt_tokens, completion_tokens } = usage as IUsage;

  const models = Object.keys(pricing);

  const pricingForModel = findPricingForModel(model, models);
  const pricingForContext = findPricingForContext(prompt_tokens, pricingForModel);

  if (!pricingForContext) {
    return;
  }

  const { input, output } = pricingForContext;

  const inputPrice = (input * prompt_tokens) / 1000;
  const outputPrice = (output * completion_tokens) / 1000;

  const price = inputPrice + outputPrice;

  return price;
};

export const findPricingForModel = (model: string, models: string[]) => {
  if (models.includes(model)) {
    return (pricing as any)[model];
  }

  const modelParts = model.split('-');
  modelParts.pop();
  const newModelName = modelParts.join('-');

  if (models.includes(newModelName)) {
    return (pricing as any)[newModelName];
  }

  return null;
};

export const findPricingForContext = (tokens: number, pricing: any) => {
  const contextSizes = Object.keys(pricing)
    .map((key) => {
      return {
        key,
        size: bytes(key),
      };
    })
    .sort(sortBy('size'));

  const contextSize = contextSizes.find((contextSize) => {
    return contextSize.size >= tokens;
  });

  if (!contextSize) {
    return null;
  }

  return pricing[contextSize.key];
};
