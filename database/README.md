# 🐘 PostgreSQL Manual via Dockerfile — Projeto TEIA

Este diretório contém o **Dockerfile puro** e o script **`init.sql`** para você subir e gerenciar manualmente o banco de dados PostgreSQL na sua VPS, sem depender de camadas automáticas ou ferramentas intermediárias.

---

## 🛠️ Como subir manualmente na sua VPS

### 1. Envie a pasta `database/` para sua VPS:
```bash
scp -r ./database seu_usuario@ip_da_sua_vps:~/teia-database
```

### 2. Acesse sua VPS:
```bash
ssh seu_usuario@ip_da_sua_vps
cd ~/teia-database
```

### 3. Crie a imagem Docker do PostgreSQL:
```bash
docker build -t teia-postgres .
```

### 4. Execute o container com persistência manual:
```bash
docker run -d \
  --name teia-db \
  -p 5432:5432 \
  -e POSTGRES_USER=teia_user \
  -e POSTGRES_PASSWORD=sua_senha_segura \
  -e POSTGRES_DB=teia_db \
  -v teia_postgres_volume:/var/lib/postgresql/data \
  --restart unless-stopped \
  teia-postgres
```

---

## 💻 Comandos Manuais Úteis

### Entrar no terminal SQL interativo (`psql`):
```bash
docker exec -it teia-db psql -U teia_user -d teia_db
```

### Comandos básicos dentro do `psql`:
- Listar tabelas: `\dt`
- Ver estrutura de uma tabela: `\d vagas`
- Consultar dados: `SELECT id, titulo, empresa FROM vagas;`
- Sair: `\q`

### Fazer Backup manual do banco (`pg_dump`):
```bash
docker exec -t teia-db pg_dump -U teia_user teia_db > backup_teia.sql
```

### Restaurar Backup:
```bash
cat backup_teia.sql | docker exec -i teia-db psql -U teia_user -d teia_db
```

---

## 📱 Como o App Mobile funciona no momento

Neste momento, conforme solicitado:
- O aplicativo está **100% autônomo e offline**, usando persistência local via **`AsyncStorage`** e **dados mockados do TEIA / CREA-MA**.
- Qualquer alteração feita no app (edição de currículo, criação/exclusão de vagas, marcação das etapas do Plano de Voo) é **salva e restaurada localmente** no dispositivo.
- Isso garante que sua apresentação e demonstração funcionem com **latência zero, sem risco de falha de conexão ou necessidade de internet ativa**.
