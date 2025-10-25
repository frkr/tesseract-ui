<script lang="ts">
	import { onMount } from 'svelte';
	import mermaid from 'mermaid';

	/*
This file its configured in: ./svelte.config.js

But does not work as a default template.
 */

	mermaid.initialize({
		theme: 'forest',
		startOnLoad: false
	});

	onMount(() => {
		setTimeout(async () => {
			await mermaid.run({
				querySelector: '.mermaid'
			});
		}, 0);
	});

	let { children } = $props();
</script>

{@render children?.()}
