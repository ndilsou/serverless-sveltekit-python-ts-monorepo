<script lang="ts">
	import Cell from '../Cell.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-screen min-h-screen flex flex-col gap-0.5 justify-center items-center bg-neutral">
	<Cell />
</div>
