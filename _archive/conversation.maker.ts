import { eleven, openAi } from '../ai-kit';
import { getVoiceMap } from '../ai-kit/ai.eleven';
import { IConversationDefinition } from '../ai-kit/types';
import { Json } from './types';
import { ConversationFs } from './conversation.fs';

type Options = {
    transcriptExists: boolean;
    log: (source: string, message: string, data?: Json) => void;
};

export class ConversationMaker {
    fs: ConversationFs;
    logger: (source: string, message: string, data?: Json) => void;

    constructor(
        public transcriptId: string,
        private conversationDefinition: IConversationDefinition,
        private options?: Partial<Options>
    ) {
        this.fs = new ConversationFs(transcriptId);
        this.logger = options?.log ?? (() => {});

        if (!options?.transcriptExists) {
            this.fs.prepareDirectory();
        }
    }

    step1_writeVoiceMap() {
        this.logger('server', 'writing voiceMap', { isRunning: true });
        const voiceMap = getVoiceMap();
        this.fs.writeVoiceMap(voiceMap);
        this.logger('server', 'writing voiceMap', { isRunning: false });
    }

    async step2_generateTranscript() {
        this.logger('LLM', 'generating transcript', {
            stage: 'Generate transcript',
            isRunning: true,
        });

        const response = await openAi.makeConversation(
            this.conversationDefinition
        );

        this.logger('LLM', 'generating transcript', {
            stage: 'Generate transcript',
            isRunning: false,
        });

        return openAi.parseResponse(response);
    }

    async step2a_improveTranscript() {
        this.logger('LLM', 'improving transcript', {
            stage: 'Improve transcript',
            isRunning: true,
        });

        const transcript = this.fs.getTranscriptSourceRaw();

        const response = await openAi.improveConversation(
            transcript,
            this.conversationDefinition.extraInstructions ?? ''
        );

        this.logger('LLM', 'improving transcript', {
            stage: 'Improve transcript',
            isRunning: false,
        });

        return openAi.parseResponse(response);
    }

    async step3a_generateSpeech() {
        this.logger('Eleven', 'generating speech', {
            stage: 'Speech',
            isRunning: true,
        });
        const transcript = this.fs.getTranscriptSource();

        this.fs.writeTranscriptLines(transcript);

        const voiceFiles = await eleven.speakTranscript(transcript);

        voiceFiles.forEach((voiceFile, index) => {
            const filename = `line-${index + 1}.mp3`;
            this.fs.writeVoiceFile(filename, voiceFile);
        });

        this.logger('Eleven', 'generating speech', {
            stage: 'Speech',
            isRunning: false,
        });
    }

    async step3b_generatePhonetics() {
        this.logger('LLM', 'generating phonetics', {
            stage: 'Phonetics',
            isRunning: true,
        });

        const transcript = this.fs.getTranscriptSource();

        const phonetics = await openAi.phoneticsTranscript(transcript);

        phonetics.forEach((sentence, index) => {
            const filename = `line-${index + 1}`;
            this.fs.writePhoneticsFile(filename, sentence.textPhonetics);
        });

        this.logger('LLM', 'generating phonetics', {
            stage: 'Phonetics',
            isRunning: false,
        });
    }

    async step4_writeTranscriptIndex() {
        this.logger('server', 'write transcript index', { isRunning: true });
        const transcript = this.fs.getTranscriptSource(true);

        this.fs.writeTranscriptIndex(transcript);

        this.logger('server', 'write transcript index', { isRunning: false });
    }

    async make() {
        // step 1: write voice map
        this.step1_writeVoiceMap();

        // step 2: generate transcript
        if (!this.options?.transcriptExists) {
            const transcript = await this.step2_generateTranscript();
            console.log('transcript ->', transcript);
            this.fs.writeTranscriptSource(transcript);
        }

        // improve?
        if (this.conversationDefinition.extraInstructions) {
            const transcript = await this.step2a_improveTranscript();
            this.fs.writeTranscriptSource(transcript);
        }

        // step 3: generate speech and phonetics
        await Promise.all([
            this.step3a_generateSpeech(),
            this.step3b_generatePhonetics(),
        ]);

        // step 4: writing transcript index
        await this.step4_writeTranscriptIndex();
    }
}
