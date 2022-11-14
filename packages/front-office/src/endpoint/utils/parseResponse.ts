export default function parseResponse(response: any) {
	const { status, statusText, headers, data } = response;

	return { status, statusText, headers, data };
}
