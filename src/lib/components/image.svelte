<script lang="ts">
	let { image: imageFile }: { image: File } = $props();
	let imageUrl = $derived(URL.createObjectURL(imageFile));
</script>

<div class="h-[86vh] w-[50vw] rounded-2xl border-4 border-base-300">
	<img src={imageUrl} alt={imageFile.name} class="h-full w-full rounded-2xl object-contain" />
</div>
