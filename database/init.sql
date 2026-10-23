-- ==========================================================
-- PROJETO TEIA / PLANO DE VOO — BANCO POSTGRESQL MANUAL
-- Script de Inicialização e Tabelas
-- ==========================================================

-- 1. TABELA DE VAGAS
CREATE TABLE IF NOT EXISTS vagas (
    id VARCHAR(64) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL DEFAULT 'Empresa',
    descricao TEXT NOT NULL,
    origem VARCHAR(32) NOT NULL DEFAULT 'empresa', -- 'exemplo' | 'empresa' | 'aluno'
    requisitos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE CURRÍCULO DO ALUNO
CREATE TABLE IF NOT EXISTS curriculos (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'principal',
    texto TEXT NOT NULL,
    palavras INTEGER NOT NULL DEFAULT 0,
    secoes_detectadas JSONB NOT NULL DEFAULT '{}'::jsonb,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE PROGRESSO DO PLANO DE VOO (Checklist)
CREATE TABLE IF NOT EXISTS progresso_plano_voo (
    etapa_id VARCHAR(128) PRIMARY KEY,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE ALUNOS (Base de demonstração do TEIA)
CREATE TABLE IF NOT EXISTS alunos (
    id VARCHAR(64) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    curso VARCHAR(255) NOT NULL DEFAULT 'Engenharia de Software',
    periodo VARCHAR(64) NOT NULL DEFAULT '6º período',
    curriculo_texto TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- DADOS INICIAIS / MOCKADOS PARA DEMONSTRAÇÃO
-- ==========================================================

-- Vagas padrão (ex1, ex2, ex3)
INSERT INTO vagas (id, titulo, empresa, descricao, origem, requisitos)
VALUES
(
    'ex1',
    'Estágio em Desenvolvimento Mobile',
    'Empresa Exemplo A',
    'Requisitos:
- Conhecimento em React Native ou Flutter
- Noções de TypeScript
- Experiência com consumo de API REST
- Git e GitHub
- Inglês para leitura técnica
Diferenciais:
- Firebase
- Testes automatizados (Jest)
- Metodologias ágeis (Scrum)',
    'exemplo',
    '[
        {"id": "req_mobile", "rotulo": "React Native ou Flutter", "obrigatorio": true, "peso": 1, "grupo": "framework_mobile", "sinonimos": ["react native", "flutter"]},
        {"id": "req_ts", "rotulo": "TypeScript", "obrigatorio": true, "peso": 1, "sinonimos": ["typescript", "ts"]},
        {"id": "req_api", "rotulo": "API REST", "obrigatorio": true, "peso": 1, "sinonimos": ["api rest", "apis rest", "rest api", "endpoints rest", "consumo de apis"]},
        {"id": "req_git", "rotulo": "Git / GitHub", "obrigatorio": true, "peso": 1, "sinonimos": ["git", "github", "controle de versao"]},
        {"id": "req_ingles", "rotulo": "Inglês para leitura", "obrigatorio": true, "peso": 1, "sinonimos": ["ingles", "english", "leitura tecnica"]},
        {"id": "dif_firebase", "rotulo": "Firebase", "obrigatorio": false, "peso": 0.5, "sinonimos": ["firebase"]},
        {"id": "dif_testes", "rotulo": "Testes automatizados (Jest)", "obrigatorio": false, "peso": 0.5, "sinonimos": ["testes automatizados", "jest", "testes unitarios"]},
        {"id": "dif_scrum", "rotulo": "Metodologias ágeis (Scrum)", "obrigatorio": false, "peso": 0.5, "sinonimos": ["scrum", "metodologias ageis", "agil"]}
    ]'::jsonb
),
(
    'ex2',
    'Estágio em Back-end',
    'Empresa Exemplo B',
    'Requisitos:
- Node.js ou Python
- SQL e PostgreSQL
- API REST
- Git
Diferenciais:
- Docker
- AWS
- Testes automatizados',
    'exemplo',
    '[
        {"id": "req_backend", "rotulo": "Node.js ou Python", "obrigatorio": true, "peso": 1, "grupo": "linguagem_backend", "sinonimos": ["node.js", "nodejs", "python"]},
        {"id": "req_sql", "rotulo": "SQL e PostgreSQL", "obrigatorio": true, "peso": 1, "sinonimos": ["sql", "postgresql", "postgres"]},
        {"id": "req_api_back", "rotulo": "API REST", "obrigatorio": true, "peso": 1, "sinonimos": ["api rest", "rest api", "endpoints rest"]},
        {"id": "req_git_back", "rotulo": "Git", "obrigatorio": true, "peso": 1, "sinonimos": ["git", "github"]},
        {"id": "dif_docker", "rotulo": "Docker", "obrigatorio": false, "peso": 0.5, "sinonimos": ["docker", "containers"]},
        {"id": "dif_aws", "rotulo": "AWS", "obrigatorio": false, "peso": 0.5, "sinonimos": ["aws", "amazon web services", "nuvem"]},
        {"id": "dif_testes_back", "rotulo": "Testes automatizados", "obrigatorio": false, "peso": 0.5, "sinonimos": ["testes automatizados", "testes unitarios", "jest"]}
    ]'::jsonb
),
(
    'ex3',
    'Estágio em Qualidade de Software',
    'Empresa Exemplo C',
    'Requisitos:
- Testes de software e casos de teste
- Jira
- Metodologias ágeis
- Inglês para leitura técnica
Diferenciais:
- Cypress ou Selenium
- SQL',
    'exemplo',
    '[
        {"id": "req_testes_qa", "rotulo": "Testes de software e casos de teste", "obrigatorio": true, "peso": 1, "sinonimos": ["testes de software", "casos de teste", "qa", "qualidade de software"]},
        {"id": "req_jira", "rotulo": "Jira", "obrigatorio": true, "peso": 1, "sinonimos": ["jira"]},
        {"id": "req_ageis_qa", "rotulo": "Metodologias ágeis", "obrigatorio": true, "peso": 1, "sinonimos": ["metodologias ageis", "scrum", "kanban"]},
        {"id": "req_ingles_qa", "rotulo": "Inglês para leitura técnica", "obrigatorio": true, "peso": 1, "sinonimos": ["ingles", "english", "leitura tecnica"]},
        {"id": "dif_automacao_qa", "rotulo": "Cypress ou Selenium", "obrigatorio": false, "peso": 0.5, "grupo": "automacao_qa", "sinonimos": ["cypress", "selenium"]},
        {"id": "dif_sql_qa", "rotulo": "SQL", "obrigatorio": false, "peso": 0.5, "sinonimos": ["sql", "banco de dados"]}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Alunos cadastrados para o painel do TEIA
INSERT INTO alunos (id, nome, curso, periodo, curriculo_texto)
VALUES
('a', 'Aluno A', 'Engenharia de Software', '6º período', 'Habilidades: React Native, TypeScript, Git, GitHub, Firebase, Jest, API REST, Scrum. Inglês avançado.'),
('b', 'Aluno B', 'Ciência da Computação', '5º período', 'Habilidades: Node.js, PostgreSQL, SQL, Docker, Git, API REST, Linux, Python. Inglês intermediário.'),
('c', 'Aluno C', 'Sistemas de Informação', '6º período', 'Habilidades: Java, Spring, SQL, MySQL, UML, Scrum, testes unitarios com JUnit, orientação a objetos.'),
('d', 'Aluno D', 'Engenharia de Computação', '4º período', 'Habilidades: HTML, CSS, JavaScript, Figma, Git.'),
('e', 'Aluno E', 'Engenharia de Software', '7º período', 'Habilidades: Selenium, Cypress, testes de software, casos de teste, Jira, Scrum, SQL. Inglês intermediário.'),
('f', 'Aluno F', 'Ciência da Computação', '3º período', '')
ON CONFLICT (id) DO NOTHING;
