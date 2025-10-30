<script lang="ts">
	import SectionCards from '../dashboard/section-cards.svelte';
	import ChartAreaInteractive from '../dashboard/chart-area-interactive.svelte';
	import DataTable from '../dashboard/data-table.svelte';
	import data from '../dashboard/data';
</script>

<div class="flex flex-col gap-4 px-2 py-4 md:gap-6 md:py-6 lg:px-2">
	<SectionCards />
	<div>
		<ChartAreaInteractive />
	</div>
	<DataTable {data} />
</div>
