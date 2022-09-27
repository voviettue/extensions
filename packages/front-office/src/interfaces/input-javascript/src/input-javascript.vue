<template>
	<div class="codemirror-custom-styles" @keydown="onKeyDown">
		<div ref="codemirrorEl" class="CodeMirror input-code"></div>
	</div>
</template>

<script setup lang="ts">
import { basicSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { scopeCompletionSource } from './complete';
import { ref, onMounted, defineEmits } from 'vue';
import { startCompletion, completeFromList } from '@codemirror/autocomplete';
import { LanguageSupport, syntaxTree } from '@codemirror/language';
import { snippets } from './snippets';
import { useApi } from '@directus/extensions-sdk';

interface Props {
	value: string;
	minLine: number;
	context: Record<string, any> | null;
}

const props = withDefaults(defineProps<Props>(), {
	minLine: 1,
	context: null,
});
const emit = defineEmits(['input']);

const api = useApi();
const context = {
	...props.context,
	$query: {},
	window,
	document,
};
const minHeight = `${props.minLine * 21 + 32}px`;
const codemirrorEl = ref(null);
buildQueryContext();

onMounted(() => {
	const js = new LanguageSupport(javascriptLanguage);

	let state = EditorState.create({
		doc: props.value ?? undefined,
		extensions: [
			basicSetup,
			js,
			javascriptLanguage.data.of({
				autocomplete: completeFromList(snippets),
			}),
			javascriptLanguage.data.of({
				autocomplete: scopeCompletionSource(context),
			}),
			keymap.of([
				{
					key: '/',
					run: commandPressSlash,
				},
			]),
			EditorView.updateListener.of((e) => {
				emit('input', e.state.doc.toString());
			}),
		],
	});

	new EditorView({
		state,
		parent: codemirrorEl.value!,
	});
});

async function getQueries() {
	try {
		const queriesApiData = await api.get('/items/cms_queries');
		return queriesApiData?.data?.data || [];
	} catch {
		//
	}
}

async function buildQueryContext() {
	const queries = await getQueries();
	const $query = {};
	for (const query of queries) {
		$query[query.key] = JSON.parse(query.output) ?? null;
	}
	context.$query = $query;
}

function commandPressSlash(view: EditorView) {
	const inner = syntaxTree(view.state).resolveInner(view.state.selection.main.from, 0);
	if (inner?.name != 'String') {
		return startCompletion(view);
	}
	return false;
}

function onKeyDown(event) {
	if (event.key === 'Escape') {
		event.stopPropagation();
	}
}
</script>

<style lang="scss" scoped>
.CodeMirror {
	padding: 0;
	width: 100%;
}

.CodeMirror :deep(.cm-scroller) {
	outline: none;
}

.CodeMirror :deep(.cm-focused) {
	outline: none;
}
.CodeMirror :deep(.cm-activeLineGutter) {
	background: none;
}
.CodeMirror :deep(.cm-gutter) {
	min-height: v-bind(minHeight);
}
.CodeMirror :deep(.cm-content) {
	padding: 16px 0;
	min-height: v-bind(minHeight);
}
.CodeMirror :deep(.cm-line) {
	position: relative;
	z-index: 2;
	margin: 0;
	overflow: visible;
	color: inherit;
	font-size: inherit;
	font-family: var(--family-monospace);
	line-height: inherit;
	white-space: pre;
	word-wrap: normal;
	background: transparent;
	border-width: 0;
	padding: 0 4px 0 8px;
}
.CodeMirror :deep(.cm-tooltip-autocomplete) {
	border-color: var(--border-normal);
	// padding: 4px 0px;
	// border-radius: 4px;
}
.CodeMirror :deep(.cm-tooltip-autocomplete li) {
	padding: 4px !important;
}
.CodeMirror :deep(.cm-tooltip-autocomplete li[aria-selected]) {
	background: var(--primary);
}
.CodeMirror :deep(.cm-completionIcon) {
	margin-right: 4px;
	margin-left: 4px;
}
.CodeMirror :deep(li span) {
	font-size: 14px;
	font-family: var(--family-monospace);
	font-weight: normal;
	font-style: inherit;
	margin-left: 4px;
}
.CodeMirror :deep(.cm-completionIcon-variable:after) {
	padding-left: 2px;
}
.CodeMirror :deep(.cm-gutterElement) {
	color: var(--foreground-subdued);
}
.small {
	position: absolute;
	right: 0;
	bottom: -20px;
	font-style: italic;
	text-align: right;
}
</style>
