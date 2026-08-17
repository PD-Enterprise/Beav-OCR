<script lang="ts">
	import { image } from '$lib/store/store.svelte';
	import { compressImage } from '$lib/utils/compressImage';
	import Icon from '@iconify/svelte';

	let input: HTMLInputElement | null = $state(null);
	let isOver = $state(false);
	let error: string | undefined = $state(undefined);
	let loading: string | undefined = $state(undefined);

	const MAX_FILE_SIZE = 20 * 1024 * 1024;
	const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

	async function setImage() {
		if (!input || !input.files) {
			error = 'No file selected';
			return;
		}
		let file = input.files[0];
		if (!ALLOWED_TYPES.includes(file.type)) {
			error = 'Only JPEG, PNG, and WebP files are accepted';
			return;
		}
		if (file.size >= MAX_FILE_SIZE) {
			loading = 'File too large. Compressing image...';
			const compressedFile = await compressImage(file);
			if (!compressedFile) {
				error = 'Error compressing image. Please try again.';
				return;
			}
			loading = undefined;
			file = compressedFile;
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
</script>

<div class="flex flex-col items-center justify-center gap-2 p-8">
	<label
		class="group flex aspect-[4/3] w-full max-w-md cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-4 border-dashed border-gray-400 bg-white p-6 text-center shadow-lg transition duration-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-2xl sm:gap-6 sm:p-8"
		class:border-blue-500={isOver}
		class:bg-blue-50={isOver}
		class:border-gray-400={!isOver}
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

		<Icon icon="material-symbols:upload" class="h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />

		<span class="px-4 sm:px-8">
			{#if loading}
				<span
					class="block text-lg font-semibold text-gray-800 transition duration-300 group-hover:text-blue-600 sm:text-xl"
				>
					Uploading Image...
				</span>
				<span class="mt-1 block text-xs text-gray-500 sm:text-sm">
					{loading}
				</span>
			{:else}
				<span
					class="block text-lg font-semibold text-gray-800 transition duration-300 group-hover:text-blue-600 sm:text-xl"
				>
					Upload Image...
				</span>
				<span class="mt-1 block text-xs text-gray-500 sm:text-sm"
					>Click or drag a file into this area</span
				>
			{/if}
		</span>
	</label>
	{#if error}
		<p class="mt-2 text-sm text-red-600">{error}</p>
	{/if}
</div>
