<script lang="ts">
	import { image } from '$lib/store/store.svelte';
	import Icon from '@iconify/svelte';

	let input: HTMLInputElement | null = $state(null);
	let isOver = $state(false);
	let error: string | undefined = $state('there is some error');

	const MAX_FILE_SIZE = 20 * 1024 * 1024;
	const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

	function setImage() {
		if (!input || !input.files) {
			error = 'No file selected';
			return;
		}
		const file = input.files[0];
		if (!ALLOWED_TYPES.includes(file.type)) {
			error = 'Only JPEG, PNG, and WebP files are accepted';
			return;
		}
		if (file.size >= MAX_FILE_SIZE) {
			error = 'File must be smaller than 9MB';
			return;
		}
		error = undefined;
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

<div class="flex flex-col items-center justify-center gap-2 p-8">
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
			accept="image/jpeg,image/png,image/webp"
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
