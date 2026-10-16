import { Competencia } from './Competencia';
import { contemTermo, normalizarTexto, removerTermo } from './normalizarTexto';

export const CATALOGO_DE_COMPETENCIAS: Competencia[] = [
  { id: 'js', rotulo: 'JavaScript', tipo: 'tech', aliases: ['javascript', 'ecmascript'] },
  { id: 'ts', rotulo: 'TypeScript', tipo: 'tech', aliases: ['typescript', 'ts'] },
  { id: 'react', rotulo: 'React', tipo: 'tech', aliases: ['react', 'reactjs', 'react.js'] },
  { id: 'rn', rotulo: 'React Native', tipo: 'tech', aliases: ['react native', 'react-native'] },
  { id: 'flutter', rotulo: 'Flutter', tipo: 'tech', aliases: ['flutter', 'dart'] },
  { id: 'kotlin', rotulo: 'Kotlin', tipo: 'tech', aliases: ['kotlin'] },
  { id: 'swift', rotulo: 'Swift', tipo: 'tech', aliases: ['swift', 'swiftui'] },
  { id: 'android', rotulo: 'Android', tipo: 'tech', aliases: ['android'] },
  { id: 'ios', rotulo: 'iOS', tipo: 'tech', aliases: ['ios'] },
  { id: 'java', rotulo: 'Java', tipo: 'tech', aliases: ['java'] },
  { id: 'python', rotulo: 'Python', tipo: 'tech', aliases: ['python'] },
  { id: 'csharp', rotulo: 'C#', tipo: 'tech', aliases: ['c#', 'csharp'] },
  { id: 'dotnet', rotulo: '.NET', tipo: 'tech', aliases: ['.net', 'dotnet', 'asp.net'] },
  { id: 'php', rotulo: 'PHP', tipo: 'tech', aliases: ['php', 'laravel'] },
  { id: 'node', rotulo: 'Node.js', tipo: 'tech', aliases: ['node', 'nodejs', 'node.js'] },
  { id: 'spring', rotulo: 'Spring', tipo: 'tech', aliases: ['spring', 'spring boot'] },
  { id: 'html', rotulo: 'HTML', tipo: 'tech', aliases: ['html', 'html5'] },
  { id: 'css', rotulo: 'CSS', tipo: 'tech', aliases: ['css', 'css3'] },
  { id: 'sql', rotulo: 'SQL', tipo: 'tech', aliases: ['sql'] },
  { id: 'pg', rotulo: 'PostgreSQL', tipo: 'tech', aliases: ['postgresql', 'postgres'] },
  { id: 'mysql', rotulo: 'MySQL', tipo: 'tech', aliases: ['mysql'] },
  { id: 'mongo', rotulo: 'MongoDB', tipo: 'tech', aliases: ['mongodb', 'mongo'] },
  { id: 'firebase', rotulo: 'Firebase', tipo: 'tech', aliases: ['firebase'] },
  {
    id: 'bd',
    rotulo: 'Banco de dados',
    tipo: 'tech',
    aliases: ['banco de dados', 'bancos de dados', 'modelagem de dados'],
  },
  {
    id: 'api',
    rotulo: 'API REST',
    tipo: 'tech',
    aliases: ['api rest', 'rest', 'restful', 'apis', 'api', 'web services', 'consumo de api'],
  },
  {
    id: 'git',
    rotulo: 'Git e GitHub',
    tipo: 'tech',
    aliases: ['git', 'github', 'gitlab', 'controle de versao'],
  },
  { id: 'docker', rotulo: 'Docker', tipo: 'tech', aliases: ['docker', 'containers', 'conteineres'] },
  {
    id: 'aws',
    rotulo: 'AWS / nuvem',
    tipo: 'tech',
    aliases: ['aws', 'amazon web services', 'cloud', 'nuvem', 'azure'],
  },
  { id: 'linux', rotulo: 'Linux', tipo: 'tech', aliases: ['linux'] },
  {
    id: 'cicd',
    rotulo: 'CI/CD',
    tipo: 'tech',
    aliases: ['ci/cd', 'ci cd', 'integracao continua', 'github actions'],
  },
  {
    id: 'tests',
    rotulo: 'Testes automatizados',
    tipo: 'tech',
    aliases: [
      'testes automatizados',
      'teste automatizado',
      'jest',
      'junit',
      'pytest',
      'tdd',
      'testes unitarios',
      'teste unitario',
      'cypress',
      'selenium',
    ],
  },
  {
    id: 'qa',
    rotulo: 'Testes de software',
    tipo: 'tech',
    aliases: [
      'qa',
      'teste de software',
      'testes de software',
      'casos de teste',
      'plano de teste',
      'testes manuais',
      'garantia de qualidade',
    ],
  },
  { id: 'jira', rotulo: 'Jira', tipo: 'tech', aliases: ['jira'] },
  {
    id: 'agil',
    rotulo: 'Metodologias ágeis',
    tipo: 'tech',
    aliases: ['scrum', 'agil', 'ageis', 'metodologias ageis', 'kanban', 'agile'],
  },
  {
    id: 'figma',
    rotulo: 'Figma / UX',
    tipo: 'tech',
    aliases: ['figma', 'ux', 'ui/ux', 'prototipacao', 'design de interface'],
  },
  { id: 'uml', rotulo: 'UML', tipo: 'tech', aliases: ['uml', 'diagramas'] },
  {
    id: 'poo',
    rotulo: 'Orientação a objetos',
    tipo: 'tech',
    aliases: ['poo', 'orientacao a objetos', 'orientado a objetos'],
  },
  {
    id: 'ed',
    rotulo: 'Estruturas de dados',
    tipo: 'tech',
    aliases: ['estrutura de dados', 'estruturas de dados', 'algoritmos'],
  },
  { id: 'excel', rotulo: 'Excel / Power BI', tipo: 'tech', aliases: ['excel', 'power bi'] },
  { id: 'ingles', rotulo: 'Inglês', tipo: 'idioma', aliases: ['ingles', 'english'] },
  { id: 'comunic', rotulo: 'Comunicação', tipo: 'soft', aliases: ['comunicacao', 'comunicativ'] },
  {
    id: 'equipe',
    rotulo: 'Trabalho em equipe',
    tipo: 'soft',
    aliases: ['trabalho em equipe', 'colaboracao'],
  },
  { id: 'proativ', rotulo: 'Proatividade', tipo: 'soft', aliases: ['proatividade', 'proativ'] },
  { id: 'lider', rotulo: 'Liderança', tipo: 'soft', aliases: ['lideranca', 'lider'] },
];

// Prepara competências ordenadas pelo maior alias
interface CompetenciaPreparada {
  competencia: Competencia;
  ordemOriginal: number;
  aliasesOrdenados: string[];
  maiorAliasLength: number;
}

const COMPETENCIAS_PREPARADAS: CompetenciaPreparada[] = CATALOGO_DE_COMPETENCIAS.map(
  (comp, index) => {
    // Normaliza aliases e ordena por comprimento decrescente
    const aliases = [...comp.aliases]
      .map((a) => normalizarTexto(a))
      .sort((a, b) => b.length - a.length);
    return {
      competencia: comp,
      ordemOriginal: index,
      aliasesOrdenados: aliases,
      maiorAliasLength: aliases[0]?.length || 0,
    };
  },
).sort((a, b) => b.maiorAliasLength - a.maiorAliasLength);

/**
 * Detecta competências em um texto usando o algoritmo da seção 6.2:
 * 1. Ordena competências pelo maior alias (do maior para menor).
 * 2. Testa aliases do maior para o menor.
 * 3. Ao encontrar, substitui o trecho encontrado por um espaço no texto de trabalho.
 * 4. Retorna as competências encontradas em ordem estável do catálogo.
 */
export function detectarCompetencias(texto: string): Competencia[] {
  let textoDeTrabalho = normalizarTexto(texto);
  const detectadas: { competencia: Competencia; ordemOriginal: number }[] = [];

  for (const prep of COMPETENCIAS_PREPARADAS) {
    for (const alias of prep.aliasesOrdenados) {
      if (contemTermo(textoDeTrabalho, alias)) {
        detectadas.push({
          competencia: prep.competencia,
          ordemOriginal: prep.ordemOriginal,
        });
        textoDeTrabalho = removerTermo(textoDeTrabalho, alias);
        break; // Passa para a próxima competência
      }
    }
  }

  // Ordena pelo índice original do catálogo para manter ordem determinística
  detectadas.sort((a, b) => a.ordemOriginal - b.ordemOriginal);
  return detectadas.map((d) => d.competencia);
}
