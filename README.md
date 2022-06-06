# Terminal's Extensions

This monorepo contains all the extensions that are used in the Terminal.

## Installation

```bash
npm install
```

## Building

To build all packages, run this command:

```bash
npm run build
```

In case you just want to build a specific package, you can pass the argument `-w` with the package name:

```bash
npm run build -w <package_name>
```

## Development

Assuming your want to develop a specific extension, you can run the following command:

```bash
npm run build -w <package_name> -- --watch
```
