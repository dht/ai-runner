import { addRequestToQueue, handleQueue, setQueueMode } from './server.queue';
import express from 'express';
import * as q from './utils/questions';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

setQueueMode(true);

let available = true;

app.post('/add', async (req, res) => {
  if (!available) {
    res.status(503).send('not available');
  }

  available = false;
  const { body } = req;
  const { prompt } = body;

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const siteUrl = req.headers['referer'] || req.headers['origin'];

  console.table({
    siteUrl,
    ip,
    prompt,
  });

  const answer = await q.boolean('continue?');

  addRequestToQueue(body);
  handleQueue();
  res.send('ok');
  available = true;
});

app.listen(4000, () => {
  console.log('ai-runner listening to port 4000');
});
