<script lang="ts">
	import { uploadStream } from '$lib/api/upload';
	import { image } from '$lib/store/store.svelte';

	let extractedText: string = $state('');
	let isExtracting: boolean = $state(false);

	async function extract() {
		isExtracting = true;
		extractedText = '';
		try {
			await uploadStream(image.value, (chunk) => {
				if (chunk.type === 'delta' && chunk.delta) {
					extractedText += chunk.delta;
				} else if (chunk.type === 'error') {
					extractedText = chunk.message;
				}
			});
		} catch (err) {
			extractedText = err instanceof Error ? err.message : 'Something went wrong.';
		} finally {
			isExtracting = false;
		}
	}
	function copy() {
		navigator.clipboard.writeText(extractedText);
	}
	function clear() {
		image.value = undefined;
		extractedText = '';
	}
</script>

<div class="flex w-full flex-col rounded-2xl border-4 border-base-300 md:w-1/2">
	<textarea
		placeholder="Extracted text will appear here..."
		class="focus:ring-opacity-50 h-full min-h-40 w-full flex-1 resize-none rounded-t-xl border-gray-300 p-2 text-left align-top focus:border-blue-500 focus:ring focus:ring-blue-200"
		readonly>{extractedText}</textarea
	>
	<div class="flex flex-row justify-between gap-2 p-2">
		<button class="btn flex-1 btn-info" onclick={extract} disabled={isExtracting}>
			{isExtracting ? 'Extracting...' : 'Extract'}
		</button>
		<button class="btn flex-1 btn-primary" onclick={copy} disabled={!extractedText}>Copy</button>
		<button class="btn flex-1 btn-secondary" onclick={clear}>Clear</button>
	</div>
</div>
