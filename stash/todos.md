## TODO

- wrangler.jsonc - Documentar aqui coisas importantes
- Vercel observability - Estudar
- static - documentar - colocar o security e o AI
- estudar entre wrangler file ou .env
- https://lucia-auth.com/tutorials/google-oauth/sveltekit
- static - manifest.json - Arrumar todos os detalhes da aplicacao.
- static - documentar no ai-guidelines.md o que cada arquivo faz
- docuentar - db:generate gera os arquivos de schema do banco de dados
- package-lock - nunca confiar. Sempre gerar um novo.
-

```text
sempre testar o que foi feito, perguntar antes de executar os testes, se der um erro procure na internet a solucao e teste novamente.

ler alguns arquivos pro projeto para tentar manter o mesmo padrao de desenvolvimento, nomenclaruras e arquitetura

não usar acentuação para não dar problemas de charset

corrigir erros de ortografia

deixar tudo em ingles mas os arquivos XPTO sao arquivos para tradução multi lingue do software
```

#### Samples guidelines

## Coding Standards

- Use **constructor injection** without @Autowired
- Make Service classes transactional boundaries
- Use @Transactional(readOnly=true) for read operations
- Create dedicated Request/Response DTOs (Java records)
- Never use JPA entities in web layer
- Don't use Lombok in production code

## Database

- Use Flyway for migrations in src/main/resources/db/migration/
- Name migrations: V{version}\_\_{description}.sql
- Configure Hibernate with ddl-auto=validate

## Testing

- Unit tests: Test components in isolation
- Integration tests: Use Testcontainers for real dependencies
- Use AssertJ for assertions
- Follow Given-When-Then pattern
- Aim for 80% code coverage minimum

## Technology Stack

- Java 21
- Spring Boot 3.2+
- Spring Data JPA
- PostgreSQL 15+
- Maven 3.9+
- JUnit 5 for testing
- Testcontainers for integration tests

## Avoid These Patterns

- Don't use field injection (@Autowired on fields)
- Don't expose JPA entities directly in REST APIs
- Don't use System.out.println() for logging
- Don't ignore exceptions or return null without good reason
