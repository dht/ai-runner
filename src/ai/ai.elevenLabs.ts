import axios, { AxiosInstance } from 'axios';
import { IConversationTranscript, IVoice, Json } from '../../_archive/types';

let instance: AxiosInstance;

let nameToIds: Json = {
  rachel: '21m00Tcm4TlvDq8ikWAM',
  domi: 'AZnzlk1XvdvUeBnXmlld',
  bella: 'EXAVITQu4vr4xnSDxMaL',
  antoni: 'ErXwobaYiN019PkySvjV',
  elli: 'MF3mGyEYCl7XYWbV9V6O',
  josh: 'TxGEqnHWrfWFTfGW9XjX',
  arnold: 'TxGEqnHWrfWFTfGW9XjX', //VR6AewLTigWG4xSOukaG
  adam: 'pNInz6obpgDQGcFmaJgB',
  sam: 'yoZ06aMxZJJ28mfd3POQ',
};

export const getVoiceMap = () => nameToIds;
export const getVoiceNames = () => Object.keys(nameToIds);

const voiceDefault = 'rachel';

export const init = (apiKey: string, extraVoices?: Json) => {
  instance = axios.create({
    baseURL: 'https://api.elevenlabs.io/v1',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use((config: any) => {
    config.headers = {
      ...config.headers,
      'xi-api-key': apiKey,
    };
    return config;
  });

  nameToIds = {
    ...nameToIds,
    ...extraVoices,
  };

  return instance;
};

let index = 0;

export const speak = async (text: string, voiceNameOrId: string = voiceDefault) => {
  const voiceId = nameToIds[voiceNameOrId.toLowerCase()] || voiceNameOrId;

  if (!voiceId) {
    console.log('No voiceId provided');
    return;
  }

  await delay(index++ * 1000);

  return instance.post(
    `/text-to-speech/${voiceId}`,
    {
      text,
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
      },
    },
    {
      responseType: 'arraybuffer',
      headers: {
        accept: 'audio/mpeg',
      },
    }
  );
};

const delay = (millis: number) => new Promise((resolve) => setTimeout(resolve, millis));

export const speakTranscript = async (transcript: IConversationTranscript) => {
  const { sentences } = transcript;

  const promises = sentences
    .map((sentence) => {
      const { speakerName } = sentence;

      const voice: IVoice = {
        id: nameToIds[speakerName.toLowerCase()],
        name: speakerName,
      };

      return {
        ...sentence,
        voice,
      };
    })
    .map((sentence) => {
      const { text, voice } = sentence;

      return speak(text, voice.id);
    });

  const responses = await Promise.all(promises);

  return responses.map((response) => response && response.data).filter((i) => i);
};

export const getVoices = async () => {
  let response;

  try {
    response = await instance.get('/voices');
    return response.data;
  } catch (err: any) {
    errorHandling(err);
  }
};

export const getVoice = async (voiceId: string) => {
  let response;

  try {
    response = await instance.get(`/voices/${voiceId}`);
    return response.data;
  } catch (err: any) {
    errorHandling(err);
  }
};

export const batch = (inputs: any[], method: any) => {
  const promises = inputs.map((input: any) => method(input));
  return Promise.all(promises);
};

const errorHandling = (err: any) => {
  if (err.response) {
    console.log(err.response.status);
    console.log(err.response.data);
  } else {
    console.log(err.message);
  }
};
