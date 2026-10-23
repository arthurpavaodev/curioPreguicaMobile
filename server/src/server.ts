import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

// CORS liberado para o app mobile Expo e web
await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Health check
app.get('/health', async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'degraded', database: 'disconnected', error: String(error) };
  }
});

// ==========================================
// VAGAS (Jobs)
// ==========================================

app.get('/api/vagas', async () => {
  const vagas = await prisma.vaga.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return vagas;
});

app.post('/api/vagas', async (request, reply) => {
  const schema = z.object({
    id: z.string().optional(),
    titulo: z.string().min(3),
    empresa: z.string().default('Empresa'),
    descricao: z.string().min(10),
    origem: z.string().default('empresa'),
    requisitos: z.any().default([]),
  });

  const body = schema.parse(request.body);
  const id = body.id || `vaga_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  const vaga = await prisma.vaga.create({
    data: {
      id,
      titulo: body.titulo,
      empresa: body.empresa,
      descricao: body.descricao,
      origem: body.origem,
      requisitos: body.requisitos,
    },
  });

  return reply.status(201).send(vaga);
});

app.delete('/api/vagas/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    await prisma.vaga.delete({
      where: { id },
    });
    return { success: true };
  } catch {
    return reply.status(404).send({ error: 'Vaga não encontrada' });
  }
});

// ==========================================
// CURRÍCULO (Curriculum)
// ==========================================

app.get('/api/curriculo', async () => {
  const curriculo = await prisma.curriculo.findUnique({
    where: { id: 'principal' },
  });

  if (!curriculo) {
    return {
      texto: '',
      palavras: 0,
      secoesDetectadas: {},
      atualizadoEm: new Date().toISOString(),
    };
  }

  return curriculo;
});

app.post('/api/curriculo', async (request) => {
  const schema = z.object({
    texto: z.string(),
    palavras: z.number().default(0),
    secoesDetectadas: z.record(z.boolean()).default({}),
  });

  const body = schema.parse(request.body);

  const curriculo = await prisma.curriculo.upsert({
    where: { id: 'principal' },
    update: {
      texto: body.texto,
      palavras: body.palavras,
      secoesDetectadas: body.secoesDetectadas,
    },
    create: {
      id: 'principal',
      texto: body.texto,
      palavras: body.palavras,
      secoesDetectadas: body.secoesDetectadas,
    },
  });

  return curriculo;
});

// ==========================================
// PLANO DE VOO (Progress)
// ==========================================

app.get('/api/plano-voo', async () => {
  const etapas = await prisma.progressoPlanoVoo.findMany();
  const mapa: Record<string, boolean> = {};
  for (const item of etapas) {
    mapa[item.etapaId] = item.concluida;
  }
  return mapa;
});

app.post('/api/plano-voo', async (request) => {
  const schema = z.object({
    etapaId: z.string(),
    concluida: z.boolean(),
  });

  const { etapaId, concluida } = schema.parse(request.body);

  await prisma.progressoPlanoVoo.upsert({
    where: { etapaId },
    update: { concluida },
    create: { etapaId, concluida },
  });

  // Retorna o mapa completo atualizado
  const etapas = await prisma.progressoPlanoVoo.findMany();
  const mapa: Record<string, boolean> = {};
  for (const item of etapas) {
    mapa[item.etapaId] = item.concluida;
  }
  return mapa;
});

// ==========================================
// ALUNOS (TEIA)
// ==========================================

app.get('/api/alunos', async () => {
  const alunos = await prisma.aluno.findMany({
    orderBy: { nome: 'asc' },
  });
  return alunos;
});

// Inicia servidor
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port, host });
  console.log(`🚀 Servidor TEIA rodando em http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
