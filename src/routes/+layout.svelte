<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><title>Beav OCR</title></svelte:head>

{@render children()}
