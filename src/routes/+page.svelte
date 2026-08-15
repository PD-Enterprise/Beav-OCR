<script lang="ts">
	import FileUpload from '$lib/components/fileUpload.svelte';
	import Image from '$lib/components/image.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import Output from '$lib/components/output.svelte';
	import { image } from '$lib/store/store.svelte';
</script>

<div class="flex flex-col gap-2">
	<Navbar />

	{#if !image.value}
		<FileUpload />
	{:else}
		<div class="flex flex-row gap-2 p-2">
			<Image image={image.value} />
			<Output />
		</div>
	{/if}
</div>
