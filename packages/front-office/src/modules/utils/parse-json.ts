export default function parseJson(str: string, defaultValue: any = null) {
	try {
		return JSON.parse(str);
	} catch {
		return defaultValue ?? str;
	}
}
