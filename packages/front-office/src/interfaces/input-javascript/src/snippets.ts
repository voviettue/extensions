import { Completion, snippetCompletion } from '@codemirror/autocomplete';

export const snippets: readonly Completion[] = [
	snippetCompletion('navigateTo("/${endpoint}")', {
		label: 'navigateTo',
		detail: 'endpoint',
		type: 'keyword',
	}),
	snippetCompletion('navigateTo("${key_of_page}")', {
		label: 'navigateTo',
		detail: 'page',
		type: 'keyword',
	}),
	snippetCompletion('navigateTo("${key_of_page}", { id: ${id} })', {
		label: 'navigateTo',
		detail: 'page with params',
		type: 'keyword',
	}),
];
