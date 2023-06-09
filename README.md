# GigaPress's Extensions Monorepo

## Contents

- [Prerequisite](#prerequisite)
- [Installation](#installation)
- [The CLI](#the-cli)
- [Local development](#local-development)
- [FAQ](#faq)

## Prerequisite

- [pnpm](https://pnpm.io/) as a node package manager

## Installation

Install dependencies and link the workspace's packages.

```bash
pnpm install
pnpm -r build
```

## The CLI

There are some different things in how we develop extensions since we're building bundle extensions - combine multiple
Directus extensions into a single bundle (package).

1. The `directus:extension` in `package.json` is an array instead of an object as standard extensions.
2. Instead of using `directus-extension build`, we use `gigapress-extension build` - a CLI tool that utilize the
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
		"build": "gigapress-extension build",
		"dev": "gigapress-extension build --watch"
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

## Local development

Assuming your project structure looks like this:

```
pwd
/Users/thien/projects/catex
```

```
catex
├── extensions
├── terminal
```

Firstly, links all packages. For example, I want to link package `@giga-extensions/base` (Do the same way for other
packages).

```bash
cd ~/projects/catex/extensions/packages/base
pnpm link --global
```

Then, link all packages to the terminal project.

```bash
cd ~/projects/catex/terminal/api
pnpm link --global \
	@giga-extensions/base \
	@giga-extensions/pro \
	@giga-extensions/front-office
```

After linking the packages, there are some changes in `api/package.json`.

```json
	"@directus/specs": "workspace:*",
+	"@giga-extensions/base": "^1.0.1",
+	"@giga-extensions/front-office": "^1.0.0",
+	"@giga-extensions/pro": "^1.0.0",
	"@godaddy/terminus": "^4.10.2",
```

We're linking the extensions to the terminal project, so any changes from the extensions will be reflected in the
terminal project.

Next, we have to add the path to extensions into `fs.allow` in `vite.config.js` to prevent the error 403 when serving
the extensions' files via `/@fs/`. Read more about `fs.allow`
[here](https://vitejs.dev/config/server-options.html#server-fs-allow).

However, The easier way is to allow all files by setting `fs.strict: false`

```js
	// vite.config.js
	fs: {
		strict: false,
		allow: [searchForWorkspaceRoot(process.cwd()), '/admin/'],
	},
```

Finally, restart the app and api.

## FAQ

Q: What if you want to build some specific extensions?

A: You can use the `--name` option to only build those extensions.

```
gigapress-extension build --name x-hooks --name x-interfaces
```
