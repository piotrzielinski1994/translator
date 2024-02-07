import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { languages } from '../data/languages';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export class OpenAi {
	static async getTranslations(baseCsv: string): Promise<string> {
		const prompt = `
      I will give you csv-like message that will contain 3 columns: lang_code, translation_key, translation_value.
      All the records within my csv will be for en-GB language.
      You need to return the message that contains only (and nothing more!)
      csv-like message (where separator is ";") that will follow my structure and contain translations
      for such languages: ${languages.join(', ')}. Here's the csv-like from me:
      \`\`\`csv
      ${baseCsv}
      \`\`\`
    `;

		return this.askQuestion(prompt);
	}

	private static async askQuestion(question: string): Promise<string> {
		const params: OpenAI.Chat.ChatCompletionCreateParams = {
			messages: [{ role: 'user', content: question }],
			model: 'gpt-3.5-turbo'
		};
		const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
		const lastMessage = chatCompletion.choices[0]?.message.content;

		if (!lastMessage) {
			throw Error('Cound not compute response.');
		}

		return lastMessage;
	}
}
