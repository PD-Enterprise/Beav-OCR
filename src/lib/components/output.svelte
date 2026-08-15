<script lang="ts">
	import { image } from '$lib/store/store.svelte';

	let extractedText: string = $state('');

	async function extract() {
		extractedText = 'Extracting text...';
	}
	function copy() {
		navigator.clipboard.writeText(extractedText);
	}
	function clear() {
		image.value = undefined;
	}
</script>

<div class="flex w-[50vw] flex-col rounded-2xl border-4 border-base-300">
	<textarea
		placeholder="Extracted text will appear here..."
		class="focus:ring-opacity-50 h-full min-h-40 w-full flex-1 resize-none rounded-t-xl border-gray-300 p-2 text-left align-top focus:border-blue-500 focus:ring focus:ring-blue-200"
		readonly>{extractedText}</textarea
	>
	<div class="flex flex-row justify-between gap-2 p-2">
		<button class="btn flex-1 btn-info" onclick={extract}>Extract</button>
		<button class="btn flex-1 btn-primary" onclick={copy}>Copy</button>
		<button class="btn flex-1 btn-secondary" onclick={clear}>Clear Image</button>
	</div>
</div>
