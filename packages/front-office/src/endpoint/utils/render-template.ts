export default function renderTemplate(template: string, params: any): string {
	const regex = /({{.*?}})/g;
	const matches = typeof template === 'string' ? [...template.matchAll(regex)] : [];
	let result = template;

	matches.forEach((match) => {
		const block = match[0];
		const statement = 'return ' + block.replace('{{', '').replace('}}', '');
		try {
			// eslint-disable-next-line no-new-func
			const fn = new Function('$param', statement);
			const value = fn(params) ?? block;
			const replacement = typeof value === 'string' ? value : JSON.stringify(value);
			result = result.replace(block, replacement);
		} catch (err) {
			// do nothing
		}
	});

	return result;
}
