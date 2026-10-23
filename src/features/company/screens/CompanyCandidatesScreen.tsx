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
  NoticeBanner,
  ProgressBar,
} from '../../../components';
import { RankeadorDeAlunos } from '../../../domain';
import { radius, spacing, tipografia } from '../../../theme';
import { JobSelector } from '../../jobs/components/JobSelector';

export function CompanyCandidatesScreen() {
  const { cores } = useTheme();
  const {
    vagasVisiveis,
    vagaSelecionada,
    alunos,
    curriculo,
    candidaturas,
    diagnosticoAtual,
    selecionarVaga,
  } = useAppData();

  const [aderenciaMinima, setAderenciaMinima] = useState<number>(60);

  const todosAlunos = useMemo(() => {
    const lista = [...alunos];
    if (curriculo && curriculo.texto.trim().length > 0) {
      lista.unshift({
        id: 'aluno_atual',
        nome: curriculo.nomeArquivo ? `Você (PDF: ${curriculo.nomeArquivo})` : 'Você (Aluno UNDB)',
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
      <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
        Banco de Candidatos
      </Text>
      <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2, marginBottom: 12 }]}>
        Ajuste a nota de corte e veja os perfis que atendem aos requisitos da vaga.
      </Text>

      <NoticeBanner
        tipo="info"
        mensagem="Perfis demonstrativos locais do TEIA. Use o controle abaixo para simular diferentes notas de corte."
      />

      <JobSelector
        vagas={vagasVisiveis}
        vagaSelecionadaId={vagaSelecionada.id}
        onSelecionarVaga={selecionarVaga}
      />

      {/* Controle Deslizante de Nota de Corte */}
      <Card>
        <View style={styles.sliderHeaderRow}>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            NOTA DE CORTE (ADERÊNCIA MÍNIMA)
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

        <View style={styles.sliderLimitsRow}>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>0%</Text>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>50%</Text>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>100%</Text>
        </View>
      </Card>

      <View style={styles.secaoTituloRow}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>
          Candidatos Qualificados
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
          {candidatosQualificados.length}{' '}
          {candidatosQualificados.length === 1 ? 'aluno' : 'alunos'}
        </Text>
      </View>

      {candidatosQualificados.length === 0 ? (
        <EmptyState
          titulo="Nenhum candidato atingiu a nota de corte"
          mensagem={`Nenhum estudante atingiu ${aderenciaMinima}% de aderência para esta vaga. Reduza a nota de corte no controle acima para ampliar a busca.`}
        />
      ) : (
        <Card semPadding>
          {candidatosQualificados.map((item, index) => {
            const { aluno, aderencia, faltam, palavrasAtendidas, palavrasFaltantes } = item;
            const valor = aderencia ?? 0;
            const isLast = index === candidatosQualificados.length - 1;
            const jaCandidatou = candidaturas.some(
              (c) => c.vagaId === vagaSelecionada.id && (c.alunoId === aluno.id || (aluno.id === 'aluno_atual')),
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                        #{index + 1} {aluno.nome}
                      </Text>
                      {jaCandidatou && (
                        <Badge rotulo="Inscrição Confirmada ✓" variante="ok" />
                      )}
                    </View>
                    <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                      {aluno.modulo}º módulo · Engenharia de Software
                    </Text>
                  </View>

                  <Badge
                    rotulo={`${valor}% compatível`}
                    variante={valor >= 75 ? 'ok' : 'destaque'}
                  />
                </View>

                <ProgressBar
                  progresso={valor}
                  altura={6}
                  cor={valor >= 75 ? cores.ok : cores.destaque}
                  style={{ marginVertical: 6 }}
                />

                {/* Badges de palavras-chave do PDF encontradas / faltantes */}
                {palavrasAtendidas && palavrasAtendidas.length > 0 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {palavrasAtendidas.slice(0, 5).map((kw, i) => (
                      <Badge key={`at_${i}`} rotulo={`✓ ${kw}`} variante="ok" />
                    ))}
                  </View>
                )}

                {faltam.length > 0 ? (
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 6 }]}>
                    <Text style={{ fontWeight: '600', color: cores.tinta }}>
                      Palavras faltantes no currículo:{' '}
                    </Text>
                    {faltam.join(', ')}
                  </Text>
                ) : (
                  <Text style={[tipografia.apoio, { color: cores.ok, marginTop: 6 }]}>
                    ✓ Atende a todas as palavras-chave exigidas pela vaga.
                  </Text>
                )}
              </View>
            );
          })}
        </Card>
      )}

      {diagnosticoAtual?.aderencia !== null && diagnosticoAtual?.aderencia !== undefined ? (
        <View
          style={[
            styles.userComparisonBox,
            {
              backgroundColor: cores.superficie,
              borderColor: cores.linha,
            },
          ]}
        >
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            SIMULAÇÃO COM O CURRÍCULO DO PERFIL ALUNO:
          </Text>
          <Text
            style={[
              tipografia.textoDestaque,
              {
                color:
                  diagnosticoAtual.aderencia >= aderenciaMinima
                    ? cores.ok
                    : cores.textoSecundario,
                marginTop: 2,
              },
            ]}
          >
            {diagnosticoAtual.aderencia}% de aderência nesta vaga (
            {diagnosticoAtual.aderencia >= aderenciaMinima
              ? 'acima da nota de corte'
              : 'abaixo da nota de corte'}
            )
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  sliderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 38,
  },
  sliderLimitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
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
    alignItems: 'flex-start',
  },
  userComparisonBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    alignItems: 'center',
  },
});
