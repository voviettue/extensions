import path from 'path';
import { readJsonSync, pathExistsSync } from 'fs-extra';
import { build as directusBuild } from '@directus/extensions-sdk/cli';

type BuildOptions = {
	watch?: boolean;
	name?: string[];
};

export default async function build(options: BuildOptions) {
	const watch = options.watch ?? false;
	const name = options.name ?? [];

	const packagePath = path.resolve('package.json');

	if (!pathExistsSync(packagePath)) {
		console.error('Current directory is not a valid package.'); // eslint-disable-line no-console
		process.exit(1);
	}

	const packageJson = readJsonSync('package.json');
	const extensionOptions = packageJson['directus:extension'];

	if (!Array.isArray(extensionOptions)) {
		console.error('Currently directory is not a valid bundle extensions.'); // eslint-disable-line no-console
		process.exit(1);
	}

	const filteredExtensionOptions = name.length
		? extensionOptions.filter((e) => name.includes(e.name))
		: extensionOptions;

	for (const e of filteredExtensionOptions) {
		console.log(`Building ${e.name}`); // eslint-disable-line no-console
		await directusBuild({
			type: e.type,
			input: e.source,
			output: e.path,
			minify: true,
			watch,
		} as any);
	}
}
