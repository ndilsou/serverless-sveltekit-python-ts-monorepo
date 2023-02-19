<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { Editor, Extension, isActive } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import Highlight from '@tiptap/extension-highlight';
	import Typography from '@tiptap/extension-typography';
    import TextAlign from '@tiptap/extension-text-align';

	export let html = '';

	let element: HTMLDivElement;
	let editor: Editor;

	const dispatch = createEventDispatcher();

	function handleDoubleClick() {
		if (editor && !editor.isEditable) {
			editor.setEditable(true);
			dispatch('modeChanged', 'edit');
		}
	}

	const SubmitAction = Extension.create({
		addKeyboardShortcuts() {
			return {
				'Shift-Enter': () => {
					if (this.editor.isEditable) {
						this.editor.setEditable(false);
						dispatch('modeChanged', 'render');
					}
					return true;
				}
			};
		}
	});
	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Highlight,
				Typography,
				TextAlign.configure({
					defaultAlignment: 'left'
				}),
				SubmitAction,
				Placeholder.configure({
					placeholder: 'Write something …'
				})
			],
			editorProps: {
				attributes: {
					class: 'min-w-full text-neutral-content bg-clip-padding my-2 h-full prose w-full mt-1'
				}
			},
			content: html,

			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	// $: if (editor) {
	// 	console.log(editor.getHTML());
	// }
</script>

<div
	class="flex flex-col justify-center items-center px-4 w-[800px] max-w-2xl rounded border border-slate-500 {editor &&
	editor.isEditable
		? 'bg-base-100 focus-within:outline focus-within:bg-neutral outline-primary-focus'
		: 'bg-neutral'}"
	on:dblclick={handleDoubleClick}
>
	<div bind:this={element} class="w-full" />
</div>

<!-- class="bg-neutral text-neutral-content rounded p-2 border bg-clip-padding mb-6 w-full h-full prose " -->
<style lang="postcss">
	/* :global(.ProseMirror) {
		@apply min-w-full;
	} */

	:global(.ProseMirror:focus) {
		@apply outline-none;
	}

	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
