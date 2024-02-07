import { TranslationsService } from '$lib/translations.service';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file || file.type !== 'text/csv') {
		return new Response(JSON.stringify({ error: 'File not found or incorrect type.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const baseTranslations = await file.text();
	const allTranslations = TranslationsService.getTranslations(baseTranslations);
	const fileBuffer = new TextEncoder().encode(allTranslations);

	return new Response(fileBuffer, {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': `attachment; filename="${file.name}"`
		}
	});
};
