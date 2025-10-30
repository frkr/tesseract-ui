<script lang="ts">
	import SectionCards from './section-cards.svelte';
	import ChartAreaInteractive from './chart-area-interactive.svelte';
	import DataTable from './data-table.svelte';
	import data from './data';
</script>

<div class="flex flex-col gap-2">
	<SectionCards />
	<div>
		<ChartAreaInteractive />
	</div>
	<DataTable {data} />
</div>
