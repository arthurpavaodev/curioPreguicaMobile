# 🚀 Guia de Deploy na VPS — Banco PostgreSQL + API TEIA

Este guia mostra como subir o banco de dados **PostgreSQL 16** e a **API Fastify REST** na sua VPS usando **Docker Compose** com apenas alguns comandos.

---

## 1. Pré-requisitos na VPS

Acesse sua VPS via terminal SSH:
```bash
ssh seu_usuario@ip_da_sua_vps
```

### Se ainda não tiver o Docker instalado:
No Ubuntu / Debian, instale o Docker e o Docker Compose com:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```
*(Saia e entre novamente no SSH para aplicar as permissões do grupo docker)*

---

## 2. Copiando os arquivos para a VPS

Você pode clonar seu repositório Git ou copiar a pasta `server` para a VPS via SCP:

```bash
# Exemplo copiando do seu computador para a VPS:
scp -r ./server seu_usuario@ip_da_sua_vps:~/teia-server
```

Ou se clonar o repositório diretamente na VPS:
```bash
git clone https://github.com/arthurpavaodev/curioPreguicaMobile.git teia
cd teia/server
```

---

## 3. Configurando as Variáveis de Ambiente

Crie o arquivo `.env` dentro da pasta `server/`:
```bash
cp .env.example .env
nano .env
```
Altere `POSTGRES_PASSWORD` para uma senha forte de sua preferência. Salve com `Ctrl+O` e saia com `Ctrl+X`.

---

## 4. Subindo o Banco e a API com Docker Compose

Dentro da pasta `server/`, execute:
```bash
docker compose up -d --build
```

O Docker irá:
1. Baixar a imagem oficial do **PostgreSQL 16**.
2. Criar o volume persistente de dados (`postgres_data`).
3. Compilar a imagem da **API Fastify + Prisma**.
4. Executar automaticamente as tabelas e o seed inicial dos dados (vagas, estudantes e currículo).

Para verificar se tudo está rodando:
```bash
docker compose ps
docker compose logs -f api
```

---

## 5. Testando a API na VPS

No terminal da VPS (ou no seu navegador):
```bash
curl http://localhost:3000/health
```

Retorno esperado:
```json
{"status":"ok","database":"connected","timestamp":"2026-10-23T..."}
```

Também é possível testar a listagem de vagas:
```bash
curl http://localhost:3000/api/vagas
```

---

## 6. Liberando a Porta no Firewall da VPS (se necessário)

Se sua VPS usa `ufw` ou firewall do provedor (DigitalOcean, AWS, Hetzner, Oracle):
```bash
sudo ufw allow 3000/tcp
```
*(A porta 5432 do PostgreSQL fica protegida na rede interna do Docker e só precisa ser aberta se você quiser conectar com o DBeaver ou PgAdmin do seu PC).*

---

## 7. Conectando o App Mobile

No aplicativo mobile, configure a URL da sua VPS em `src/data/api/apiConfig.ts`:
```typescript
export const API_BASE_URL = 'http://SEU_IP_DA_VPS:3000';
```
*(ou pelo menu de configurações de conexão remota no próprio app)*.
