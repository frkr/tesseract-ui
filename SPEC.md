# Specification Document (use Mermaid.js, also use sequence diagrams)

> This document mirrors;

- SPEC.md
- src/routes/doc/spec/+page.md

---

## Modulo Equipamentos

- Disponibiliza dashboard em `/equipamentos` com estatisticas por status, filtros dinamicos e pendencias de aprovacao.
- Pagina `/equipamentos/novo` permite cadastro SSR com validacao na camada server e persistencia mockada em memoria.
- Detalhes individuais em `/equipamentos/[id]` exibem linha do tempo, historico de movimentacoes e atalhos para novas solicitacoes.
- Fluxo de movimentacao dividido em solicitacao (`/equipamentos/[id]/movimentar`) e decisao (`/equipamentos/[id]/aprovar`) cobrindo aprovacao e conclusao.
- Armazena dados via store `src/lib/server/equipamentos/store.ts`, com funcoes para listar, criar, aprovar e concluir movimentacoes, alem de dados seeds para demo.