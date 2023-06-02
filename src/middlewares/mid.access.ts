import { cleanIp, getIP, isSameNetwork } from '../utils/ip';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const os = require('os');

export const accessMiddleware = (req: Request, res: Response, next: any) => {
  const requestIp = cleanIp(req.ip);

  const isSame = isSameNetwork(requestIp);

  if (!isSame) {
    logger.error('Blocking access from ' + requestIp);

    res.status(401).json({
      ok: false,
      message: 'Unauthorized',
    });
    return;
  }

  next();
};
