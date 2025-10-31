# Database Schema (Mermaid)

This document mirrors src/lib/db/schema.ts. Update this file whenever the TypeScript schema changes.

```mermaid  
erDiagram
    USER {
        TEXT id PK
        INT age
        TEXT name
        TEXT username "NOT NULL, UNIQUE"
        TEXT password_hash
    }

    SESSION {
        TEXT id PK
        TEXT user_id FK "NOT NULL"
        TIMESTAMPTZ expires_at "NOT NULL"
    }

    GROUP {
        TEXT id PK "UNIQUE"
        TEXT name
    }

    REL_GROUP {
        TEXT group_id PK,FK "NOT NULL"
        TEXT user_id PK,FK "NOT NULL"
        BOOLEAN adm "DEFAULT false"
    }

    USER ||--o{ SESSION : "has sessions"
    USER ||--o{ REL_GROUP : "member of"
    GROUP ||--o{ REL_GROUP : "has members"
```

Details and constraints

- session.user_id → user.id (foreign key, required)
- user.username is UNIQUE and NOT NULL
- session.expires_at uses a timestamp with timezone (mode: date) and is NOT NULL
- group.id is UNIQUE and serves as the primary key
- rel_group has a composite primary key (group_id, user_id)
- rel_group.group_id → group.id (foreign key, required)
- rel_group.user_id → user.id (foreign key, required)
- rel_group.adm is a boolean flag indicating admin status

