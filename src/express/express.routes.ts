import express from 'express';
import { getJobLogs, newJob } from './express.controllers';

export const router = express.Router();

router.post('/jobs', newJob);
router.get('/jobs/:jobId/logs', getJobLogs);
