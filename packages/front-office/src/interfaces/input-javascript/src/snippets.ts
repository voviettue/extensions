import { Completion, snippetCompletion } from '@codemirror/autocomplete';

export const snippets: readonly Completion[] = [
	snippetCompletion('executeQuery("${key_of_query}")', {
		label: 'executeQuery',
		detail: '',
		type: 'keyword',
	}),
	snippetCompletion('executeQuery("${key_of_query}", { id: ${id} })', {
		label: 'executeQuery',
		detail: 'with params',
		type: 'keyword',
	}),
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
	snippetCompletion('showModal("${key_of_widget}")', {
		label: 'showModal',
		detail: '',
		type: 'keyword',
	}),
	snippetCompletion('closeModal("${key_of_widget}")', {
		label: 'closeModal',
		detail: '',
		type: 'keyword',
	}),
];
