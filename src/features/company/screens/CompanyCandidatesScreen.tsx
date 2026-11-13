import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import {
  Badge,
  Card,
  EmptyState,
} from '../../../components';
import { RankeadorDeAlunos } from '../../../domain';
import { spacing, tipografia } from '../../../theme';
import { JobSelector } from '../../jobs/components/JobSelector';

export function CompanyCandidatesScreen() {
  const { cores } = useTheme();
  const {
    vagasVisiveis,
    vagaSelecionada,
    alunos,
    curriculo,
    candidaturas,
    selecionarVaga,
  } = useAppData();

  const [aderenciaMinima, setAderenciaMinima] = useState<number>(60);

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

  const candidatosQualificados = useMemo(() => {
    if (!vagaSelecionada) return [];
    const ranking = RankeadorDeAlunos.rankear(todosAlunos, vagaSelecionada, aderenciaMinima);
    return ranking.filter((r) => r.aderencia !== null && r.aderencia >= aderenciaMinima);
  }, [todosAlunos, vagaSelecionada, aderenciaMinima]);

  if (!vagaSelecionada) {
    return (
      <View style={[styles.container, { backgroundColor: cores.fundo, padding: spacing.lg }]}>
        <EmptyState
          titulo="Nenhuma vaga selecionada"
          mensagem="Selecione uma vaga para filtrar os candidatos qualificados."
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
          Candidatos
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
          Filtre os estudantes pela nota de corte desejada.
        </Text>
      </View>

      <JobSelector
        vagas={vagasVisiveis}
        vagaSelecionadaId={vagaSelecionada.id}
        onSelecionarVaga={selecionarVaga}
      />

      {/* Controle Enxuto de Nota de Corte */}
      <Card>
        <View style={styles.sliderHeaderRow}>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            NOTA DE CORTE MÍNIMA
          </Text>
          <Text style={[tipografia.monoValor, { color: cores.destaque }]}>
            {aderenciaMinima}%
          </Text>
        </View>

        <Slider
          minimumValue={0}
          maximumValue={100}
          step={5}
          value={aderenciaMinima}
          onValueChange={setAderenciaMinima}
          minimumTrackTintColor={cores.destaque}
          maximumTrackTintColor={cores.linha}
          thumbTintColor={cores.destaque}
          style={styles.slider}
          accessibilityRole="adjustable"
          accessibilityLabel={`Aderência mínima de ${aderenciaMinima}%`}
        />
      </Card>

      <View style={styles.secaoTituloRow}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>
          Qualificados
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
          {candidatosQualificados.length}{' '}
          {candidatosQualificados.length === 1 ? 'candidato' : 'candidatos'}
        </Text>
      </View>

      {candidatosQualificados.length === 0 ? (
        <EmptyState
          titulo="Nenhum candidato atingiu a nota de corte"
          mensagem={`Reduza a nota de corte (${aderenciaMinima}%) no controle acima para ampliar a busca.`}
        />
      ) : (
        <Card semPadding>
          {candidatosQualificados.map((item, index) => {
            const { aluno, aderencia, faltam } = item;
            const valor = aderencia ?? 0;
            const isLast = index === candidatosQualificados.length - 1;
            const jaCandidatou = candidaturas.some(
              (c) => c.vagaId === vagaSelecionada.id && c.alunoId === aluno.id,
            );

            return (
              <View
                key={aluno.id}
                style={[
                  styles.candidateRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: cores.linha },
                ]}
              >
                <View style={styles.candidateTop}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <View style={styles.nameRow}>
                      <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                        #{index + 1} {aluno.nome}
                      </Text>
                      {jaCandidatou ? (
                        <Badge rotulo="Inscrito ✓" variante="ok" />
                      ) : null}
                    </View>
                    <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                      {aluno.modulo}º módulo ·{' '}
                      {faltam.length > 0
                        ? `Falta: ${faltam.slice(0, 3).join(', ')}${faltam.length > 3 ? '...' : ''}`
                        : 'Atende todos os requisitos'}
                    </Text>
                  </View>

                  <Badge
                    rotulo={`${valor}%`}
                    variante={valor >= 75 ? 'ok' : 'destaque'}
                  />
                </View>
              </View>
            );
          })}
        </Card>
      )}
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
  sliderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 34,
    marginTop: 4,
  },
  secaoTituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  candidateRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  candidateTop: {
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
