// Simplify append suffix `-dev` to packages version.
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const packagesInWorkspace = execSync('pnpm ls --depth 1 -r --json');
const list = JSON.parse(String(packagesInWorkspace)).filter((pkg) => pkg.name !== 'gigapress-extensions-monorepo');

for (const { name, version, path } of list) {
	const packageJson = JSON.parse(readFileSync(`${path}/package.json`, 'utf8'));
	packageJson.version = `${version}-dev`;
	writeFileSync(`${path}/package.json`, JSON.stringify(packageJson, null, 2));

	console.log(`Added suffix -dev to ${name}`); // eslint-disable-line no-console
}
