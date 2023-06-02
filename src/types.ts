export type Json = Record<string, any>;

export type IJob = {
  jobId: string;
  prompt: string;
  nodeType: string;
  agent: IAgent;
  model: IModel;
  api: IApi;
  creationTime: number;
  startTime?: number;
  endTime?: number;
  duration?: number;
  status?: JobStatus;
  error?: string;
  response?: IApiRespone;
};

export type JobStatus = 'queue' | 'running' | 'done' | 'error';

export type IAgent = {
  mode: string;
  system: string;
  includeContext?: boolean;
};

export type AgentMode = 'continues' | 'singular';

export type IModel = {
  modelType: ModelType;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
};

export type ModelType = 'openAI';

export type IJobs = Record<string, IJob>;

export type IApiRespone = {
  responseId: string;
  content: string;
  usage?: IUsage;
  price?: number;
  isSuccess: boolean;
  error?: string;
};

export type IUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export type ApiType = 'elevenLabs' | 'dalle' | 'whisper' | 'openJourney';
export type ApiFormatInput = 'default' | 'conversation';

export type IApi = {
  apiType: ApiType;
  formatInput: ApiFormatInput;
  purpose?: string;
};

export type IJobMethod = (job: IJob) => Promise<IApiRespone>;
