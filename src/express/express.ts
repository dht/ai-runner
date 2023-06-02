import express from 'express';
import cors from 'cors';
import kleur from 'kleur';
import { router } from './express.routes';
import { accessMiddleware } from '../middlewares/mid.access';
import { startQueue } from '../queue/handleQueue';
export const start = (port: number) => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(accessMiddleware);
  app.use(router);

  app.listen(port, () => {
    console.log(`${kleur.magenta('ai-runner')} listening to port ${kleur.cyan(port)}`);

    startQueue();
  });
};
