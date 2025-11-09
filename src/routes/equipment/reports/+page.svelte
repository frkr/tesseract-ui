<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	function downloadCsv() {
		const blob = new Blob([data.csvPreview], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'relatorio-equipamentos.csv';
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Relatorios e exportacoes</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Gere arquivos CSV para auditoria ou integracao externa. Em breve: templates para Excel e API.
		</p>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h2 class="text-lg font-semibold">Resumo atual</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
				<p class="mt-2 text-2xl font-semibold">{data.summary.total}</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Ativos</p>
				<p class="mt-2 text-2xl font-semibold">{data.summary.byStatus.ativo}</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Em manutencao</p>
				<p class="mt-2 text-2xl font-semibold">{data.summary.byStatus.em_manutencao}</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Inativos</p>
				<p class="mt-2 text-2xl font-semibold">{data.summary.byStatus.inativo}</p>
			</div>
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div>
				<h2 class="text-lg font-semibold">Pre-visualizacao CSV</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					Use o botao para baixar o arquivo. Substituir por pipeline Drizzle + storage posteriormente.
				</p>
			</div>
			<button
				type="button"
				class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				on:click={downloadCsv}
			>
				Baixar CSV
			</button>
		</div>
		<pre class="mt-4 max-h-72 overflow-auto rounded-md bg-muted/40 p-4 text-xs">{data.csvPreview}</pre>
	</section>
</div>

