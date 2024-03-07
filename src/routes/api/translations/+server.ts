import { OpenAi } from '$lib/openai.service';
import { CsvValidator } from '$lib/validator.service';
import type { RequestHandler } from '@sveltejs/kit';
import { csvMimeTypes } from '../../../data/csvMimeTypes';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) return takeErrorResponse('File not found.');
	if (!csvMimeTypes.includes(file.type)) return takeErrorResponse('File not type of CSV.');

	const baseTranslations = await file.text();

	if (!CsvValidator.isValid(baseTranslations)) {
		return takeErrorResponse('File has incorrect separators. Expected semicolons.');
	}

	try {
		const allTranslations = await OpenAi.getTranslations(baseTranslations);
		const fileBuffer = new TextEncoder().encode(allTranslations);

		return new Response(fileBuffer, {
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': `attachment; filename="${file.name}"`
			}
		});
	} catch {
		takeErrorResponse('Could not compute response.', 500);
	}
};

const takeErrorResponse = (message: string, status = 400): Response => {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
};
