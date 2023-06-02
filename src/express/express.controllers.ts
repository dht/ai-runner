import { Request, Response } from 'express';
import { askQuestions } from '../utils/questions';
import { logJson } from '../utils/logger';
import { guid4 } from '../utils/guid';
import { addToQueue, allJobs } from '../queue/queue';
import { IJob } from '../types';

export const newJob = async (req: Request, res: Response) => {
  const { request, node } = req.body;
  const { prompt } = request;
  const { nodeType, agent, model, api } = node;

  const newJob: IJob = {
    jobId: guid4(),
    prompt,
    nodeType,
    agent,
    model,
    api,
    creationTime: Date.now(),
    status: 'queue',
  };

  addToQueue(newJob);

  logJson(newJob);

  res.json({
    success: true,
    jobId: newJob.jobId,
  });
};

export const getJobLogs = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = allJobs[jobId];
  res.json(job);
};
