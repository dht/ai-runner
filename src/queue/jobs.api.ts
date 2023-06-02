import { get } from 'lodash';
import { image } from '../ai/ai.openAI';
import { ApiType, IJob, IJobMethod } from '../types';

export const runJob = async (job: IJob) => {
  const { api } = job;
  const { apiType } = api;

  const method = map[apiType];

  return method(job);
};

export const dalle = async (job: IJob) => {
  try {
    const { prompt } = job;

    const response = await image({
      prompt,
      n: 1,
      response_format: 'url',
      size: '512x512',
    });

    return {
      responseId: '',
      content: get(response, 'data[0].url', ''),
      isSuccess: true,
    };
  } catch (err: any) {
    return {
      responseId: '',
      content: '',
      isSuccess: false,
      error: err.message,
    };
  }
};

const map: Record<ApiType, IJobMethod> = {
  dalle,
  elevenLabs: dalle,
  whisper: dalle,
};
