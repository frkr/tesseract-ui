<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let selectedAction: { id: string; decision: 'aprovado' | 'rejeitado' } | null = null;

	function chooseDecision(id: string, decision: 'aprovado' | 'rejeitado') {
		selectedAction = { id, decision };
	}
 </script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Painel de aprovacao</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Analise movimentacoes pendentes e aplique decisao. Integrar operacoes com backend em etapa
			posterior.
		</p>

		<div class="mt-6 overflow-x-auto">
			<table class="min-w-full divide-y divide-border text-sm">
				<thead class="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
					<tr>
						<th class="px-4 py-3 font-medium">Solicitacao</th>
						<th class="px-4 py-3 font-medium">Equipamento</th>
						<th class="px-4 py-3 font-medium">Origem</th>
						<th class="px-4 py-3 font-medium">Destino</th>
						<th class="px-4 py-3 font-medium">Solicitante</th>
						<th class="px-4 py-3 font-medium">Aprovador</th>
						<th class="px-4 py-3 font-medium">Acoes</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border bg-background">
					{#if data.pending.length === 0}
						<tr>
							<td class="px-4 py-6 text-center text-muted-foreground" colspan="7">
								Nenhuma solicitacao pendente.
							</td>
						</tr>
					{:else}
						{#each data.pending as item}
							<tr class="hover:bg-muted/40">
								<td class="px-4 py-3 font-medium">{item.id}</td>
								<td class="px-4 py-3">
									<div class="flex flex-col">
										<span class="font-medium">{item.equipmentName}</span>
										<span class="text-xs text-muted-foreground">
											Enviado em {new Date(item.requestedAt).toLocaleString()}
										</span>
									</div>
								</td>
								<td class="px-4 py-3">{item.originName}</td>
								<td class="px-4 py-3">{item.targetName}</td>
								<td class="px-4 py-3">{item.requester}</td>
								<td class="px-4 py-3">{item.approver}</td>
								<td class="px-4 py-3">
									<div class="flex gap-2">
										<button
											class="rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-500/30"
											type="button"
											on:click={() => chooseDecision(item.id, 'aprovado')}
										>
											Aprovar
										</button>
										<button
											class="rounded-md bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-500/30"
											type="button"
											on:click={() => chooseDecision(item.id, 'rejeitado')}
										>
											Rejeitar
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		{#if selectedAction}
			<div class="mt-4 rounded-md border border-dashed border-border/60 bg-muted/40 p-4 text-sm">
				<p>
					Acao preparada: <span class="font-semibold">{selectedAction.decision}</span> para movimento
					<span class="font-semibold">{selectedAction.id}</span>. Integrar com acao server para
					registrar decisao.
				</p>
			</div>
		{/if}
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h2 class="text-lg font-semibold">Historico recente</h2>
		<div class="mt-4 space-y-3">
			{#if data.history.length === 0}
				<p class="text-sm text-muted-foreground">Sem registros historicos.</p>
			{:else}
				{#each data.history as item}
					<div class="rounded-md border border-border/60 p-4">
						<div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
							<div>
								<p class="text-sm font-medium">{item.equipmentName}</p>
								<p class="text-xs text-muted-foreground">
									Movimento {item.id} - {item.originName} para {item.targetName}
								</p>
							</div>
							<span
								class={`rounded-full px-3 py-1 text-xs font-semibold ${
									item.status === 'aprovado'
										? 'bg-emerald-500/20 text-emerald-700'
										: 'bg-rose-500/20 text-rose-700'
								}`}
							>
								{item.status}
							</span>
						</div>
						<p class="mt-2 text-xs text-muted-foreground">
							Solicitado por {item.requester} e avaliado por {item.approver} em{' '}
							{new Date(item.requestedAt).toLocaleDateString()}
						</p>
					</div>
				{/each}
			{/if}
		</div>
	</section>
</div>

