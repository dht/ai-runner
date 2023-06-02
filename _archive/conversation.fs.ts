import fs from 'fs-extra';
import { IConversationSentence, IConversationTranscript, Json } from './types';

export class ConversationFs {
    constructor(public transcriptId: string) {}

    get root() {
        return `./output/transcript-${this.transcriptId}`;
    }

    prepareDirectory() {
        fs.ensureDirSync(this.root);
    }

    getTranscriptSourceRaw() {
        return fs.readFileSync(this.root + '/transcript.source.txt', 'utf8');
    }

    getTranscriptSource(withMeta?: boolean): IConversationTranscript {
        const raw = this.getTranscriptSourceRaw();

        const sentences: IConversationSentence[] = [];

        raw.split('\n')
            .filter((line) => line)
            .forEach((line: string, index: number) => {
                const [person, ...text] = line.split(':');

                const item: IConversationSentence = {
                    id: `l-${index}`,
                    speakerName: person,
                    text: text.join(':'),
                    audioUrl: `line-${index + 1}.mp3`,
                };

                if (withMeta) {
                    const phoneticsFilename = `line-${index + 1}`;
                    item.textPhonetics =
                        this.getPhoneticsFile(phoneticsFilename);
                }

                sentences.push(item);
            });

        return {
            id: this.transcriptId,
            raw,
            sentences,
        };
    }

    writeTranscriptSource(source: string) {
        fs.writeFileSync(this.root + '/transcript.source.txt', source, 'utf8');
    }

    writeTranscriptLines(transcript: IConversationTranscript) {
        const { sentences } = transcript;

        sentences.forEach((sentence: IConversationSentence, index: number) => {
            const filepath = `${this.root}/line-${index + 1}.txt`;
            fs.writeFileSync(filepath, sentence.text);
        });
    }

    getVoiceMap() {
        return fs.readJsonSync(this.root + '/transcript.voices.json');
    }

    writeVoiceMap(voicesMap: Json) {
        fs.writeJsonSync(this.root + '/transcript.voices.json', voicesMap, {
            spaces: 4,
        });
    }

    getFilesByType(fileExtension: string) {
        return fs
            .readdirSync(this.root)
            .filter((file: string) =>
                file.match(new RegExp(`.${fileExtension}$`))
            );
    }

    getVoiceFile(filename: string) {
        return fs.createReadStream(`${this.root}/${filename}`);
    }

    getPhoneticsFile(filename: string) {
        return fs
            .readFileSync(`${this.root}/${filename}.phonetics`, 'utf8')
            .split('\n')
            .filter((i) => i)
            .join('\n');
    }

    writeVoiceFile(filename: string, audio: Buffer) {
        fs.writeFileSync(`${this.root}/${filename}`, audio);
    }

    writeSrtFile(filename: string, srt: string) {
        fs.writeFileSync(`${this.root}/${filename}.srt`, srt);
    }

    writePhoneticsFile(filename: string, phonetics: string) {
        fs.writeFileSync(`${this.root}/${filename}.phonetics`, phonetics);
    }

    writeTranscriptIndex(conversation: IConversationTranscript) {
        fs.writeJsonSync(`${this.root}/transcript.index.json`, conversation, {
            spaces: 4,
        });
    }

    writeLog(content: string) {
        fs.writeFileSync(`${this.root}/log.txt`, content);
    }
}
