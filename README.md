# GigaPress's Extensions Monorepo

## Prerequisite

- [pnpm](https://pnpm.io/) as a node package manager

## Installation

Install dependencies and link the workspace's packages.

```bash
pnpm install
```

## The CLI

There are some different things in how we develop extensions since we're building bundle extensions - combine multiple
Directus extensions into a single bundle (package).

1. The `directus:extension` in `package.json` is an array instead of an object as standard extensions.
2. Instead of using `directus-extensions build`, we use `gigapress-extensions build` - a CLI tool that utilize the
   functions of `@directus/extensions-skd` package.

**package.json**

Here is an example of how we define a bundle extension.

```json
{
	"name": "@giga-extensions/x",
	"directus:extension": [
		{
			"name": "x-hooks",
			"type": "hook",
			"path": "dist/x-hooks.js",
			"source": "src/x/hooks/index.ts",
			"host": "^9.15.0"
		},
		{
			"name": "x-interfaces",
			"type": "interface",
			"path": "dist/x-interfaces.js",
			"source": "src/x/interfaces/index.ts",
			"host": "^9.15.0"
		}
		// other extensions
	],
	"script": {
		"build": "gigapress-extensions build",
		"dev": "gigapress-extensions build --watch"
	}
}
```

**CLI usage**

```
Usage: gigapress-extension [command] [options]

Options:
  -v, --version    output the version number
  -h, --help       display help for command

Commands:
  build [options]  Bundle a Directus extension to a single entrypoint
  help [command]   display help for command
```

**FAQ**

Q:What if you want to only build some specific extensions?

A:You can use the `--name` option to only build those extensions.

```
gigapress-extensions build --name x-hooks --name x-interfaces
```
