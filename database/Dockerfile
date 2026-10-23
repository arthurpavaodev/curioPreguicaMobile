FROM postgres:16-alpine

LABEL maintainer="TEIA - UNDB"
LABEL description="Banco de dados PostgreSQL para o projeto TEIA / Plano de Voo"

# Configurações padrão de locale e timezone
ENV TZ=America/Sao_Paulo
ENV POSTGRES_DB=teia_db
ENV POSTGRES_USER=teia_user

# O script init.sql copiado para /docker-entrypoint-initdb.d/
# é executado automaticamente pelo Postgres na primeira inicialização
COPY init.sql /docker-entrypoint-initdb.d/01_init.sql

EXPOSE 5432
