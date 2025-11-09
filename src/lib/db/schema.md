# Database Schema (Mermaid)

> This document mirrors; Update this file whenever the TypeScript schema changes!

- src/lib/db/schema.ts.
- src/routes/doc/schema/+page.md

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

    LOCATION {
        TEXT id PK
        TEXT name "NOT NULL"
        TEXT parent_id FK
        LOCATION_TYPE type "NOT NULL"
        TEXT timezone
        BOOLEAN is_active "DEFAULT true, NOT NULL"
        TIMESTAMPTZ created_at "DEFAULT now(), NOT NULL"
        TIMESTAMPTZ updated_at "DEFAULT now(), NOT NULL"
    }

    EQUIPMENT {
        TEXT id PK
        TEXT asset_code "NOT NULL, UNIQUE"
        TEXT name "NOT NULL"
        TEXT description
        TEXT category
        EQUIPMENT_CRITICALITY criticality "DEFAULT media, NOT NULL"
        EQUIPMENT_STATUS status "DEFAULT ativo, NOT NULL"
        TEXT location_id FK
        TEXT custodian_user_id FK
        DATE acquisition_date
        DATE depreciation_end
        JSONB metadata
        TIMESTAMPTZ created_at "DEFAULT now(), NOT NULL"
        TIMESTAMPTZ updated_at "DEFAULT now(), NOT NULL"
    }

    EQUIPMENT_MOVEMENT {
        TEXT id PK
        TEXT equipment_id FK "NOT NULL"
        TEXT requested_by_user_id FK "NOT NULL"
        TEXT authorized_by_user_id FK
        TEXT origin_location_id FK
        TEXT target_location_id FK
        MOVEMENT_STATUS status "DEFAULT pendente, NOT NULL"
        TEXT authorization_note
        TEXT movement_note
        TIMESTAMPTZ requested_at "DEFAULT now(), NOT NULL"
        TIMESTAMPTZ authorized_at
        TIMESTAMPTZ executed_at
        TIMESTAMPTZ created_at "DEFAULT now(), NOT NULL"
        TIMESTAMPTZ updated_at "DEFAULT now(), NOT NULL"
    }

    EQUIPMENT_MAINTENANCE {
        TEXT id PK
        TEXT equipment_id FK "NOT NULL"
        MAINTENANCE_TYPE type "NOT NULL"
        TIMESTAMPTZ scheduled_for
        TIMESTAMPTZ started_at
        TIMESTAMPTZ completed_at
        TEXT technician_user_id FK
        TEXT result_note
        JSONB attachments
        EQUIPMENT_STATUS status_after
        TIMESTAMPTZ created_at "DEFAULT now(), NOT NULL"
        TIMESTAMPTZ updated_at "DEFAULT now(), NOT NULL"
    }

    EQUIPMENT_AUDIT_LOG {
        TEXT id PK
        TEXT equipment_id FK "NOT NULL"
        EQUIPMENT_AUDIT_EVENT event_type "NOT NULL"
        JSONB payload
        TEXT actor_user_id FK
        TIMESTAMPTZ created_at "DEFAULT now(), NOT NULL"
    }

    MOVEMENT_POLICY {
        TEXT id PK
        MOVEMENT_POLICY_SCOPE scope_type "NOT NULL"
        TEXT role_key
        TEXT location_id FK
        TEXT category
        BOOLEAN requires_dual_approval "DEFAULT false, NOT NULL"
        TEXT approver_user_id FK
        BOOLEAN is_active "DEFAULT true, NOT NULL"
        TIMESTAMPTZ created_at "DEFAULT now(), NOT NULL"
        TIMESTAMPTZ updated_at "DEFAULT now(), NOT NULL"
    }

    USER ||--o{ SESSION : "has sessions"
    USER ||--o{ REL_GROUP : "member of"
    GROUP ||--o{ REL_GROUP : "has members"
    LOCATION ||--o{ LOCATION : "parent of"
    LOCATION ||--o{ EQUIPMENT : "armazenamento"
    USER ||--o{ EQUIPMENT : "custodia"
    USER ||--o{ EQUIPMENT_MOVEMENT : "solicita"
    USER ||--o{ EQUIPMENT_MOVEMENT : "autoriza"
    LOCATION ||--o{ EQUIPMENT_MOVEMENT : "origem"
    LOCATION ||--o{ EQUIPMENT_MOVEMENT : "destino"
    EQUIPMENT ||--o{ EQUIPMENT_MOVEMENT : "movimenta"
    EQUIPMENT ||--o{ EQUIPMENT_MAINTENANCE : "tem manutencoes"
    USER ||--o{ EQUIPMENT_MAINTENANCE : "executa"
    EQUIPMENT ||--o{ EQUIPMENT_AUDIT_LOG : "auditoria"
    USER ||--o{ EQUIPMENT_AUDIT_LOG : "atua"
    LOCATION ||--o{ MOVEMENT_POLICY : "escopo opcional"
    USER ||--o{ MOVEMENT_POLICY : "aprovador"
    EQUIPMENT ||--o{ MOVEMENT_POLICY : "categoria opcional"
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
- location.parent_id → location.id (opcional, permite hierarquia)
- equipment.location_id → location.id (opcional)
- equipment.custodian_user_id → user.id (opcional)
- equipment_movement.equipment_id → equipment.id (obrigatorio)
- equipment_movement.requested_by_user_id → user.id (obrigatorio)
- equipment_movement.authorized_by_user_id → user.id (opcional)
- equipment_movement.origin_location_id → location.id (opcional)
- equipment_movement.target_location_id → location.id (opcional)
- equipment_maintenance.equipment_id → equipment.id (obrigatorio)
- equipment_maintenance.technician_user_id → user.id (opcional)
- equipment_audit_log.equipment_id → equipment.id (obrigatorio)
- equipment_audit_log.actor_user_id → user.id (opcional)
- movement_policy.location_id → location.id (opcional)
- movement_policy.approver_user_id → user.id (opcional)
- Enums definidos: EQUIPMENT_STATUS, EQUIPMENT_CRITICALITY, LOCATION_TYPE, MOVEMENT_STATUS, MAINTENANCE_TYPE, EQUIPMENT_AUDIT_EVENT, MOVEMENT_POLICY_SCOPE
