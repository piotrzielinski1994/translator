export class CsvValidator {
	static isValid(csv: string): boolean {
		const lines = csv
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line !== '');

		return lines.every((line) => {
			const semicolonCount = line.split(';').length - 1;
			return semicolonCount === 2;
		});
	}
}
