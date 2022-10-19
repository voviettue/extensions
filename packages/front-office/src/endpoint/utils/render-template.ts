export default function renderTemplate(template: string, params: any): string {
	if (!template) return template;

	try {
		const regex = /({{.*?}})/g;
		const matches = [...String(template).matchAll(regex)];
		let result = template;

		for (const match of matches) {
			const block = match.shift()!;
			const statement = 'return ' + block.replace('{{', '').replace('}}', '');
			// eslint-disable-next-line no-new-func
			const fn = new Function('$param', statement);
			const value = fn(params) ?? block;
			const replacement = typeof value === 'string' ? value : JSON.stringify(value);
			result = result.replace(block, replacement);
		}

		return result;
	} catch {
		return template;
	}
}
