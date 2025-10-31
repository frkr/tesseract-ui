<script lang="ts">
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	import data from '$lib/components/data';
</script>

<div class="flex flex-col gap-2">
	<SectionCards />
	<div>
		<ChartAreaInteractive />
	</div>
	<DataTable {data} />
</div>
