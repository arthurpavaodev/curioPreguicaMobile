import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco PostgreSQL...');

  // 1. Vagas Iniciais
  const vagasCount = await prisma.vaga.count();
  if (vagasCount === 0) {
    console.log('Inserindo vagas padrão...');
    await prisma.vaga.createMany({
      data: [
        {
          id: 'ex1',
          titulo: 'Estágio em Desenvolvimento Mobile',
          empresa: 'Empresa Exemplo A',
          origem: 'exemplo',
          descricao: `Requisitos:\n- Conhecimento em React Native ou Flutter\n- Noções de TypeScript\n- Experiência com consumo de API REST\n- Git e GitHub\n- Inglês para leitura técnica\nDiferenciais:\n- Firebase\n- Testes automatizados (Jest)\n- Metodologias ágeis (Scrum)`,
          requisitos: [
            { id: 'req_mobile', rotulo: 'React Native ou Flutter', obrigatorio: true, peso: 1, grupo: 'framework_mobile', sinonimos: ['react native', 'flutter'] },
            { id: 'req_ts', rotulo: 'TypeScript', obrigatorio: true, peso: 1, sinonimos: ['typescript', 'ts'] },
            { id: 'req_api', rotulo: 'API REST', obrigatorio: true, peso: 1, sinonimos: ['api rest', 'apis rest', 'rest api', 'endpoints rest', 'consumo de apis'] },
            { id: 'req_git', rotulo: 'Git / GitHub', obrigatorio: true, peso: 1, sinonimos: ['git', 'github', 'controle de versao'] },
            { id: 'req_ingles', rotulo: 'Inglês para leitura', obrigatorio: true, peso: 1, sinonimos: ['ingles', 'english', 'leitura tecnica'] },
            { id: 'dif_firebase', rotulo: 'Firebase', obrigatorio: false, peso: 0.5, sinonimos: ['firebase'] },
            { id: 'dif_testes', rotulo: 'Testes automatizados (Jest)', obrigatorio: false, peso: 0.5, sinonimos: ['testes automatizados', 'jest', 'testes unitarios'] },
            { id: 'dif_scrum', rotulo: 'Metodologias ágeis (Scrum)', obrigatorio: false, peso: 0.5, sinonimos: ['scrum', 'metodologias ageis', 'agil'] },
          ],
        },
        {
          id: 'ex2',
          titulo: 'Estágio em Back-end',
          empresa: 'Empresa Exemplo B',
          origem: 'exemplo',
          descricao: `Requisitos:\n- Node.js ou Python\n- SQL e PostgreSQL\n- API REST\n- Git\nDiferenciais:\n- Docker\n- AWS\n- Testes automatizados`,
          requisitos: [
            { id: 'req_backend', rotulo: 'Node.js ou Python', obrigatorio: true, peso: 1, grupo: 'linguagem_backend', sinonimos: ['node.js', 'nodejs', 'python'] },
            { id: 'req_sql', rotulo: 'SQL e PostgreSQL', obrigatorio: true, peso: 1, sinonimos: ['sql', 'postgresql', 'postgres'] },
            { id: 'req_api_back', rotulo: 'API REST', obrigatorio: true, peso: 1, sinonimos: ['api rest', 'rest api', 'endpoints rest'] },
            { id: 'req_git_back', rotulo: 'Git', obrigatorio: true, peso: 1, sinonimos: ['git', 'github'] },
            { id: 'dif_docker', rotulo: 'Docker', obrigatorio: false, peso: 0.5, sinonimos: ['docker', 'containers'] },
            { id: 'dif_aws', rotulo: 'AWS', obrigatorio: false, peso: 0.5, sinonimos: ['aws', 'amazon web services', 'nuvem'] },
            { id: 'dif_testes_back', rotulo: 'Testes automatizados', obrigatorio: false, peso: 0.5, sinonimos: ['testes automatizados', 'testes unitarios', 'jest'] },
          ],
        },
        {
          id: 'ex3',
          titulo: 'Estágio em Qualidade de Software',
          empresa: 'Empresa Exemplo C',
          origem: 'exemplo',
          descricao: `Requisitos:\n- Testes de software e casos de teste\n- Jira\n- Metodologias ágeis\n- Inglês para leitura técnica\nDiferenciais:\n- Cypress ou Selenium\n- SQL`,
          requisitos: [
            { id: 'req_testes_qa', rotulo: 'Testes de software e casos de teste', obrigatorio: true, peso: 1, sinonimos: ['testes de software', 'casos de teste', 'qa', 'qualidade de software'] },
            { id: 'req_jira', rotulo: 'Jira', obrigatorio: true, peso: 1, sinonimos: ['jira'] },
            { id: 'req_ageis_qa', rotulo: 'Metodologias ágeis', obrigatorio: true, peso: 1, sinonimos: ['metodologias ageis', 'scrum', 'kanban'] },
            { id: 'req_ingles_qa', rotulo: 'Inglês para leitura técnica', obrigatorio: true, peso: 1, sinonimos: ['ingles', 'english', 'leitura tecnica'] },
            { id: 'dif_automacao_qa', rotulo: 'Cypress ou Selenium', obrigatorio: false, peso: 0.5, grupo: 'automacao_qa', sinonimos: ['cypress', 'selenium'] },
            { id: 'dif_sql_qa', rotulo: 'SQL', obrigatorio: false, peso: 0.5, sinonimos: ['sql', 'banco de dados'] },
          ],
        },
      ],
    });
  }

  // 2. Alunos
  const alunosCount = await prisma.aluno.count();
  if (alunosCount === 0) {
    console.log('Inserindo alunos demonstrativos...');
    await prisma.aluno.createMany({
      data: [
        {
          id: 'a',
          nome: 'Aluno A',
          curso: 'Engenharia de Software',
          periodo: '6º período',
          curriculo: 'Habilidades: React Native, TypeScript, Git, GitHub, Firebase, Jest, API REST, Scrum. Inglês avançado.',
        },
        {
          id: 'b',
          nome: 'Aluno B',
          curso: 'Ciência da Computação',
          periodo: '5º período',
          curriculo: 'Habilidades: Node.js, PostgreSQL, SQL, Docker, Git, API REST, Linux, Python. Inglês intermediário.',
        },
        {
          id: 'c',
          nome: 'Aluno C',
          curso: 'Sistemas de Informação',
          periodo: '6º período',
          curriculo: 'Habilidades: Java, Spring, SQL, MySQL, UML, Scrum, testes unitarios com JUnit, orientação a objetos.',
        },
        {
          id: 'd',
          nome: 'Aluno D',
          curso: 'Engenharia de Computação',
          periodo: '4º período',
          curriculo: 'Habilidades: HTML, CSS, JavaScript, Figma, Git.',
        },
        {
          id: 'e',
          nome: 'Aluno E',
          curso: 'Engenharia de Software',
          periodo: '7º período',
          curriculo: 'Habilidades: Selenium, Cypress, testes de software, casos de teste, Jira, Scrum, SQL. Inglês intermediário.',
        },
        {
          id: 'f',
          nome: 'Aluno F',
          curso: 'Ciência da Computação',
          periodo: '3º período',
          curriculo: '',
        },
      ],
    });
  }

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
