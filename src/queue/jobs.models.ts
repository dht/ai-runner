import { ChatCompletionRequestMessage } from 'openai';
import { chatCompletion, parseResponse } from '../ai/ai.openAI';
import { IJob } from '../types';

export const runJob = async (job: IJob) => {
  try {
    const { prompt, agent, model, api } = job;
    const { system } = agent;

    const messages: ChatCompletionRequestMessage[] = [];

    const { modelName } = model;

    if (system) {
      messages.push({
        role: 'system',
        content: system,
      });
    }

    if (prompt) {
      messages.push({
        role: 'user',
        content: prompt,
      });
    }

    const responseRaw = await chatCompletion(messages, modelName);

    const response = parseResponse(responseRaw);
    return response;
  } catch (err: any) {
    return {
      responseId: '',
      content: '',
      isSuccess: false,
      error: err.message,
    };
  }
};
