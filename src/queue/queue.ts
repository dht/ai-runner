import { IJob, IJobs } from '../types';
import { logger } from '../utils/logger';

export const queue: IJob[] = [];
export const allJobs: IJobs = {};

export const addToQueue = (job: IJob) => {
  logger.info(`Adding job ${job.jobId} to queue`);
  queue.push(job);

  allJobs[job.jobId] = job;
};

export const getNextJob = () => {
  return queue.shift();
};

export const updateJob = (jobId: string, change: Partial<IJob>) => {
  const job = allJobs[jobId];

  if (!job) {
    return;
  }

  Object.assign(job, change);

  console.log('job ->', job);
};

export const getRunningJobsCount = () => {
  return Object.values(allJobs).filter((job) => job.status === 'running').length;
};
