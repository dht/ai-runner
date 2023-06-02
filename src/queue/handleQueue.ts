import { IApiRespone, IJob } from '../types';
import { logger } from '../utils/logger';
import { runJob as runJobApi } from './jobs.api';
import { runJob as runJobModel } from './jobs.models';
import { getNextJob, getRunningJobsCount, updateJob } from './queue';

let interval: any;

const STEP_INTERVAL = 1000;
const MAX_RUNNING_REQUESTS = 10;

export const startQueue = () => {
  interval = setInterval(() => {
    step();
  }, STEP_INTERVAL);
};

export const stopQueue = () => {
  clearInterval(interval);
};

export const step = () => {
  const runningRequestsCount = getRunningJobsCount();

  if (runningRequestsCount >= MAX_RUNNING_REQUESTS) {
    return;
  }

  const job = getNextJob();

  if (!job) {
    return;
  }

  runJob(job);
};

export const runJob = async (job: IJob) => {
  logger.info(`Running job ${job.jobId}`);

  updateJob(job.jobId, {
    status: 'running',
    startTime: Date.now(),
  });

  const { api } = job;

  let response: IApiRespone;

  if (api) {
    response = await runJobApi(job);
  } else {
    response = await runJobModel(job);
  }

  if (!response.isSuccess) {
    logger.error(`Error running job ${job.jobId}: ${response.error}`);

    updateJob(job.jobId, {
      status: 'error',
      error: response.error,
    });

    return;
  }

  updateJob(job.jobId, {
    status: 'done',
    endTime: Date.now(),
    duration: Date.now() - job.startTime!,
    response,
  });
};
