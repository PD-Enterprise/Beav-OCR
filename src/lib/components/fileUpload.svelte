<script lang="ts">
	import { image } from '$lib/store/store.svelte';
	import Icon from '@iconify/svelte';

	let input: HTMLInputElement | null = $state(null);
	let isOver = $state(false);
	let error: string | undefined = $state(undefined);

	function setImage() {
		if (!input || !input.files) {
			error = 'No file selected';
			return;
		}
		const file = input.files[0];
		image.value = file;
	}
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isOver = true;
	}
	function handleDragLeave() {
		isOver = false;
	}
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isOver = false;

		if (!event.dataTransfer) {
			return;
		}
		if (event.dataTransfer.files && input) {
			input.files = event.dataTransfer.files;
			setImage();
		}
	}

	$effect(() => {
		console.log(isOver);
	});
</script>

<div class="flex items-center justify-center p-8">
	<label
		class="group flex aspect-square w-full max-w-md cursor-pointer flex-col items-center justify-center gap-6 rounded-3xl border-4 border-dashed border-gray-400 bg-white text-center shadow-lg transition duration-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-2xl"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
	>
		<input
			type="file"
			id="file-upload"
			class="hidden"
			accept="image/*"
			bind:this={input}
			onchange={setImage}
			multiple={false}
		/>

		<Icon icon="material-symbols:upload" class="h-16 w-16 text-gray-400" />

		<span class="px-8">
			<span
				class="block text-xl font-semibold text-gray-800 transition duration-300 group-hover:text-blue-600"
			>
				Upload Image...
			</span>
			<span class="mt-1 block text-sm text-gray-500">Click or drag a file into this area</span>
		</span>
	</label>
	{#if error}
		<p class="mt-2 text-sm text-red-600">{error}</p>
	{/if}
</div>
