<script lang="ts">
	let { image: imageFile }: { image: File } = $props();
	let imageUrl = $derived(URL.createObjectURL(imageFile));
</script>

<div class="h-[50vh] w-full rounded-2xl border-4 border-base-300 md:h-[86vh] md:w-1/2">
	<img src={imageUrl} alt={imageFile.name} class="h-full w-full rounded-2xl object-contain" />
</div>
