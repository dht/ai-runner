import Table from 'cli-table3';
import { Json } from '../types';
import kleur from 'kleur';
import * as os from 'os';

export const pino = require('pino');

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

logger.loading = function (message: string) {
  const loadingChars = ['|', '/', '-', '\\']; // Array of loading characters
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.clearLine(0); // Clear the previous loading message
    process.stdout.cursorTo(0); // Move the cursor to the beginning of the line
    process.stdout.write(`Loading ${loadingChars[i]} ${message}`); // Write the loading message with the current loading character
    i = (i + 1) % loadingChars.length; // Move to the next loading character
  }, 200); // Adjust the interval duration as per your preference

  // Return a function to stop the loading indicator
  return function stopLoading() {
    clearInterval(interval); // Stop the interval
    process.stdout.clearLine(0); // Clear the loading message
    process.stdout.cursorTo(0); // Move the cursor to the beginning of the line
  };
};

export const logJson = (json: Json) => {
  const table = new Table({
    head: ['Key', 'Value'],
  });

  Object.keys(json).forEach((key) => {
    const valueRaw = json[key];

    let value = String(valueRaw);

    if (typeof valueRaw === 'object') {
      value = JSON.stringify(valueRaw);
    }

    value = value.replace(os.homedir(), '~');

    table.push([kleur.green(key), value]);
  });

  console.log(table.toString());
};
