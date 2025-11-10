-- Criar os bancos de dados
CREATE DATABASE bbardi;
CREATE DATABASE bbardipre;
CREATE DATABASE bbardidev;

-- Criar usuário bbardi com senha aleatória
-- IMPORTANTE: Altere a senha abaixo para uma senha segura de sua escolha

-- Check if user exists and drop it if it does
DO
$$
    BEGIN
        IF EXISTS (SELECT
                   FROM pg_catalog.pg_roles
                   WHERE rolname = 'bbardi') THEN
            DROP OWNED BY bbardi;
            DROP USER bbardi;
        END IF;
    END
$$;
CREATE USER bbardi WITH PASSWORD 'Kx9mPvL2wQnR7sT5jF';

ALTER USER bbardi WITH PASSWORD 'Kx9mPvL2wQnR7sT5jF';

-- Conceder privilégios no banco bbardi
GRANT ALL PRIVILEGES ON DATABASE bbardi TO postgres;

-- Conceder privilégios no banco bbardipre
GRANT ALL PRIVILEGES ON DATABASE bbardipre TO postgres;

-- Conceder privilégios no banco bbardipro
GRANT ALL PRIVILEGES ON DATABASE bbardidev TO postgres;

-- Conectar em cada banco e conceder privilégios no schema
-- Execute os comandos abaixo conectado em cada banco de dados

-- Para o banco bbardi:
-- \c bbardi
GRANT USAGE ON SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO bbardi;

-- Para o banco bbardipre:
-- \c bbardipre
GRANT USAGE ON SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO bbardi;

-- Para o banco bbardipro:
-- \c bbardipro

\c postgres;
GRANT USAGE ON SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bbardi;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bbardi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO bbardi;

commit