<!-- <script lang="ts">
	import '../prosemirror.css';

	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	// import 'prosemirror-view/style/prosemirror.css';
	import { Schema, DOMParser } from 'prosemirror-model';
	import { schema } from 'prosemirror-schema-basic';
	import { addListNodes } from 'prosemirror-schema-list';
	import { exampleSetup } from 'prosemirror-example-setup';
	import { onDestroy, onMount } from 'svelte';

	const mySchema = new Schema({
		nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
		marks: schema.spec.marks
	});

	let view: EditorView;
	let editorElement: HTMLDivElement;
	let contentElement: HTMLDivElement;

	onMount(() => {
		view = new EditorView(editorElement, {
			state: EditorState.create({
				doc: DOMParser.fromSchema(mySchema).parse(contentElement),
				plugins: exampleSetup({ schema: mySchema })
			})
		});
	});

	onDestroy(() => {
		if (view) {
			view.destroy();
		}
	});
</script>

<div class="flex justify-center items-center p-4 w-[800px] max-w-2xl">
	<div
		bind:this={editorElement}
		class="bg-neutral text-neutral-content rounded p-2 border bg-clip-padding mb-6 w-full h-full prose "
	/>
	<div bind:this={contentElement} class="hidden">
		<h3>Hello ProseMirror</h3>

		<p>This is editable text. You can focus it and start typing.</p>

		<p>
			To apply styling, you can select a piece of text and manipulate its styling from the menu. The
			basic schema supports <em>emphasis</em>, <strong>strong text</strong>,
			<a href="http://marijnhaverbeke.nl/blog">links</a>, <code>code font</code>, and images.
		</p>

		<p>
			Block-level structure can be manipulated with key bindings (try ctrl-shift-2 to create a level
			2 heading, or enter in an empty textblock to exit the parent block), or through the menu.
		</p>

		<p>Try using the “list” item in the menu to wrap this paragraph in a numbered list.</p>
	</div>
</div>

<style lang="postcss">
	:global(.ProseMirror-menubar) {
		@apply bg-neutral text-neutral-content;
	}

	:global(.ProseMirror:focus) {
		@apply outline-none;
	}

	/*:global(.ProseMirror-menu-dropdown-wrap) {
		padding: 1px 0 1px 4px;
		display: inline-block;
		position: relative;
	}

	:global(.ProseMirror-menu-dropdown) {
		vertical-align: 1px;
		cursor: pointer;
		position: relative;
		padding-right: 15px;
	} */
</style> -->
