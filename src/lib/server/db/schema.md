# Database Schema (Mermaid)

This document mirrors src/lib/server/db/schema.ts. Update this file whenever the TypeScript schema changes.

```mermaid
erDiagram
    USER {
        TEXT id PK
        INT age
        TEXT username "NOT NULL, UNIQUE"
        TEXT password_hash "NOT NULL"
    }

    SESSION {
        TEXT id PK
        TEXT user_id FK "NOT NULL"
        TIMESTAMPTZ expires_at "NOT NULL"
    }

    USER ||--o{ SESSION : "has sessions"
```

Details and constraints
- session.user_id → user.id (foreign key, required)
- user.username is UNIQUE and NOT NULL
- session.expires_at uses a timestamp with timezone (mode: date) and is NOT NULL
