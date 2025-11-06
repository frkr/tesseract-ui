| Propriedade                          | Descrição                              |
|--------------------------------------|----------------------------------------|
| ${{ github.event.issue.number }}     | Número da issue                        |
| ${{ github.event.issue.title }}      | Título da issue                        |
| ${{ github.event.issue.body }}       | Corpo/descrição da issue               |
| ${{ github.event.issue.user.login }} | Nome de usuário de quem abriu a issue  |
| ${{ github.event.issue.labels }}     | Labels associadas à issue              |
| ${{ github.event.issue.assignees }}  | Pessoas atribuídas à issue             |
| ${{ github.event.issue.state }}      | Estado da issue (aberta, fechada, etc) |
| ${{ github.event.issue.created_at }} | Data/hora de criação                   |


```yml
name: Issue Information
on:
  issues:
    types: [opened]

jobs:
  get_issue_info:
    runs-on: ubuntu-latest
    steps:
      - name: Exibir informações da issue
        run: |
          echo "Issue Number: ${{ github.event.issue.number }}"
          echo "Title: ${{ github.event.issue.title }}"
          echo "Body: ${{ github.event.issue.body }}"
          echo "Created by: ${{ github.event.issue.user.login }}"
```

```yml
- name: Exibir payload completo
  run: echo "${{ toJSON(github.event) }}"
```