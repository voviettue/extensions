import { Command } from 'commander';
import build from './commands/build';

const pkg = require('../../../package.json');

const program = new Command();

program.name('gigapress-extension').usage('[command] [options]');
program.version(pkg.version, '-v, --version');

program
	.command('build')
	.description('Bundle a Directus extension to a single entrypoint')
	.option('-w, --watch', 'watch and rebuild on changes')
	.option('-n, --name <name...>', 'build specific extensions by name')
	.action(build);

program.parse(process.argv);
