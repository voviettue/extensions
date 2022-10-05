export default function renderTemplate(template: string, context: any): string {
	const regex = /({{.*?}})/g;
	const matches = typeof template === 'string' ? [...template.matchAll(regex)] : [];
	let result = template;

	matches.forEach((match) => {
		const block = match[0];
		if (!block) return;

		const statement = 'return ' + block.replace('{{', '').replace('}}', '');
		const { $query } = context;
		try {
			// eslint-disable-next-line no-new-func
			const fn = new Function('$query', statement);
			const value = fn($query) ?? block;
			const replacement = typeof value === 'string' ? value : JSON.stringify(value);
			result = result.replace(block, replacement);
		} catch (err) {
			// do nothing
		}
	});

	return result;
}
