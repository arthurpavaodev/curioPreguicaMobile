import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import {
  Badge,
  Card,
  EmptyState,
} from '../../../components';
import { RankeadorDeAlunos } from '../../../domain';
import { radius, spacing, tipografia } from '../../../theme';
import { JobSelector } from '../../jobs/components/JobSelector';

export function TeiaDashboardScreen() {
  const { cores } = useTheme();
  const { vagasVisiveis, vagaSelecionada, alunos, curriculo, candidaturas, selecionarVaga } =
    useAppData();

  const todosAlunos = useMemo(() => {
    const lista = [...alunos];
    if (curriculo && curriculo.texto.trim().length > 0) {
      lista.unshift({
        id: 'aluno_atual',
        nome: curriculo.nomeArquivo ? `Você (${curriculo.nomeArquivo})` : 'Você (Aluno UNDB)',
        modulo: 6,
        curriculoTexto: curriculo.texto,
      });
    }
    return lista;
  }, [alunos, curriculo]);

  const resumo = useMemo(() => {
    if (!vagaSelecionada) return null;
    return RankeadorDeAlunos.resumirPainel(todosAlunos, vagaSelecionada);
  }, [todosAlunos, vagaSelecionada]);

  const ranking = useMemo(() => {
    if (!vagaSelecionada) return [];
    return RankeadorDeAlunos.rankear(todosAlunos, vagaSelecionada, 60);
  }, [todosAlunos, vagaSelecionada]);

  if (!vagaSelecionada) {
    return (
      <View style={[styles.container, { backgroundColor: cores.fundo, padding: spacing.lg }]}>
        <EmptyState
          titulo="Nenhuma vaga selecionada"
          mensagem="Selecione uma oportunidade para visualizar os indicadores dos alunos."
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.headerBlock}>
        <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
          Painel TEIA
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
          Indicadores e ranking de compatibilidade dos estudantes por vaga.
        </Text>
      </View>

      <JobSelector
        vagas={vagasVisiveis}
        vagaSelecionadaId={vagaSelecionada.id}
        onSelecionarVaga={selecionarVaga}
      />

      {/* Três Indicadores Essenciais */}
      {resumo ? (
        <View style={styles.kpiRow}>
          <Card style={styles.kpiCard}>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              ALUNOS
            </Text>
            <Text style={[tipografia.monoValor, { color: cores.tinta, marginTop: 2 }]}>
              {resumo.cadastrados}
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              COM CV
            </Text>
            <Text style={[tipografia.monoValor, { color: cores.ok, marginTop: 2 }]}>
              {resumo.comCurriculo}
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              MÉDIA
            </Text>
            <Text style={[tipografia.monoValor, { color: cores.destaque, marginTop: 2 }]}>
              {resumo.aderenciaMedia}%
            </Text>
          </Card>
        </View>
      ) : null}

      {/* Ranking Limpo de Alunos */}
      <View style={styles.sectionHeader}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>
          Ranking de Aderência
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
          {ranking.length} estudantes
        </Text>
      </View>

      <Card semPadding>
        {ranking.map((item, index) => {
          const { aluno, aderencia, faltam } = item;
          const isLast = index === ranking.length - 1;
          const temCurriculo = aderencia !== null;

          const badgeVariante: 'ok' | 'destaque' | 'atencao' | 'padrao' =
            !temCurriculo
              ? 'padrao'
              : aderencia >= 75
              ? 'ok'
              : aderencia >= 45
              ? 'destaque'
              : 'atencao';

          const jaCandidatou = candidaturas.some(
            (c) => c.vagaId === vagaSelecionada.id && c.alunoId === aluno.id,
          );

          return (
            <View
              key={aluno.id}
              style={[
                styles.studentRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: cores.linha },
              ]}
            >
              <View style={styles.studentTop}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <View style={styles.nameRow}>
                    <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                      #{index + 1} {aluno.nome}
                    </Text>
                    {jaCandidatou ? <Badge rotulo="Inscrito ✓" variante="ok" /> : null}
                  </View>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                    {aluno.modulo}º módulo ·{' '}
                    {!temCurriculo
                      ? 'Currículo pendente'
                      : faltam.length > 0
                      ? `Falta: ${faltam.slice(0, 3).join(', ')}${faltam.length > 3 ? '...' : ''}`
                      : 'Todos os requisitos atendidos'}
                  </Text>
                </View>

                <Badge
                  rotulo={temCurriculo ? `${aderencia}%` : 'Sem CV'}
                  variante={badgeVariante}
                />
              </View>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 36,
  },
  headerBlock: {
    marginBottom: spacing.md,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  kpiCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderRadius: radius.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  studentRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  studentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
});
