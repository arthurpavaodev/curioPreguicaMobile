import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Vaga } from '../../../../domain';
import {
  Aviso,
  Botao,
  Cartao,
  EstadoVazio,
  Medidor,
  SeletorDeVaga,
  Selo,
} from '../../components';
import { useDiagnostico } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

interface DiagnosticoScreenProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
  onNavegarParaCurriculo?: () => void;
}

export function DiagnosticoScreen({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
  onNavegarParaCurriculo,
}: DiagnosticoScreenProps) {
  const { cores } = useTheme();
  const {
    diagnostico,
    carregando,
    erro,
    podeRefinarComIA,
    refinarComIA,
  } = useDiagnostico(vagaSelecionadaId);

  if (carregando) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  if (!diagnostico) {
    return (
      <View style={[styles.container, { backgroundColor: cores.fundo }]}>
        <EstadoVazio
          titulo="Nenhum diagnóstico"
          mensagem="Selecione uma vaga para visualizar a análise de aderência do seu currículo."
        />
      </View>
    );
  }

  const {
    aderencia,
    nivel,
    totalRequisitos,
    requisitosAtendidosCount,
    requisitosAtendidos,
    requisitosFaltantes,
    pontosFortes,
    pontosFracos,
    ortografia,
    origemAnalise,
  } = diagnostico;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
        Diagnóstico de Aderência
      </Text>
      <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
        Veja como seu currículo pontua nos requisitos e onde você pode evoluir.
      </Text>

      {/* Seletor de vaga */}
      <SeletorDeVaga
        vagas={vagas}
        vagaSelecionadaId={vagaSelecionadaId}
        onSelecionarVaga={onSelecionarVaga}
      />

      {/* Medidor e Nível de Aderência */}
      <Cartao>
        <Medidor aderencia={aderencia} nivelTexto={nivel.rotulo} />

        <View style={styles.resumoRequisitosRow}>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            REQUISITOS ATENDIDOS
          </Text>
          <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
            {requisitosAtendidosCount} de {totalRequisitos} requisitos
          </Text>
        </View>

        {/* Origem da análise */}
        <View style={styles.origemAnaliseContainer}>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
            {origemAnalise === 'ia'
              ? 'Análise feita com IA'
              : 'Análise básica por palavras-chave'}
          </Text>

          {podeRefinarComIA ? (
            <Botao
              titulo="Refinar com IA"
              onPress={refinarComIA}
              variante="padrao"
              style={{ marginTop: 8 }}
            />
          ) : null}
        </View>
      </Cartao>

      {/* Se não houver requisitos na vaga */}
      {aderencia === null ? (
        <Aviso
          tipo="atencao"
          mensagem="Sem requisitos reconhecidos nesta vaga. Cole uma descrição com uma lista clara de requisitos para calcular a aderência."
        />
      ) : null}

      {/* Requisitos Atendidos */}
      <View style={styles.secaoHeader}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>
          Requisitos Atendidos ({requisitosAtendidos.length})
        </Text>
      </View>

      {requisitosAtendidos.length === 0 ? (
        <Cartao>
          <Text style={[tipografia.texto, { color: cores.textoSecundario }]}>
            Nenhum requisito atendido identificado no currículo atual.
          </Text>
        </Cartao>
      ) : (
        requisitosAtendidos.map((item, idx) => (
          <Cartao key={`atendido_${idx}`}>
            <View style={styles.itemHeader}>
              <Text style={[tipografia.textoDestaque, { color: cores.tinta, flex: 1 }]}>
                {item.requisito.rotulo}
              </Text>
              <Selo rotulo="atendido" variante="ok" />
            </View>

            {item.evidencia ? (
              <View style={[styles.evidenciaBox, { backgroundColor: cores.isDark ? '#0d1a24' : '#F4F7F9' }]}>
                <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 2 }]}>
                  EVIDÊNCIA NO CURRÍCULO:
                </Text>
                <Text style={[tipografia.apoio, { color: cores.tinta, fontStyle: 'italic' }]}>
                  "{item.evidencia}"
                </Text>
              </View>
            ) : null}
          </Cartao>
        ))
      )}

      {/* Requisitos que Faltam */}
      <View style={styles.secaoHeader}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>
          Requisitos que Faltam ({requisitosFaltantes.length})
        </Text>
      </View>

      {requisitosFaltantes.length === 0 ? (
        <Cartao>
          <Text style={[tipografia.texto, { color: cores.ok }]}>
            Parabéns! Todos os requisitos identificados estão atendidos.
          </Text>
        </Cartao>
      ) : (
        requisitosFaltantes.map((item, idx) => (
          <Cartao key={`faltante_${idx}`}>
            <View style={styles.itemHeader}>
              <Text style={[tipografia.textoDestaque, { color: cores.tinta, flex: 1 }]}>
                {item.requisito.rotulo}
              </Text>
              <Selo
                rotulo={item.obrigatorio ? 'obrigatório' : 'diferencial'}
                variante={item.obrigatorio ? 'erro' : 'atencao'}
              />
            </View>

            <View style={[styles.evidenciaBox, { backgroundColor: cores.isDark ? '#1a1815' : '#FCF8F2' }]}>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 2 }]}>
                AÇÃO SUGERIDA:
              </Text>
              <Text style={[tipografia.apoio, { color: cores.tinta }]}>
                {item.acaoSugerida}
              </Text>
            </View>
          </Cartao>
        ))
      )}

      {/* Pontos Fortes do Currículo */}
      <View style={styles.secaoHeader}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>Pontos Fortes do Currículo</Text>
      </View>
      <Cartao>
        {pontosFortes.map((pf, idx) => (
          <View key={`pf_${idx}`} style={styles.bulletRow}>
            <Text style={[tipografia.textoDestaque, { color: cores.ok, marginRight: 8 }]}>✓</Text>
            <Text style={[tipografia.texto, { color: cores.tinta, flex: 1 }]}>{pf}</Text>
          </View>
        ))}
      </Cartao>

      {/* Pontos a Melhorar */}
      {pontosFracos.length > 0 ? (
        <>
          <View style={styles.secaoHeader}>
            <Text style={[tipografia.secao, { color: cores.tinta }]}>Pontos a Melhorar</Text>
          </View>
          <Cartao>
            {pontosFracos.map((pfr, idx) => (
              <View key={`pfr_${idx}`} style={styles.bulletRow}>
                <Text style={[tipografia.textoDestaque, { color: cores.destaque, marginRight: 8 }]}>
                  •
                </Text>
                <Text style={[tipografia.texto, { color: cores.tinta, flex: 1 }]}>{pfr}</Text>
              </View>
            ))}
          </Cartao>
        </>
      ) : null}

      {/* Ortografia */}
      <View style={styles.secaoHeader}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>Ortografia e Escrita</Text>
      </View>
      <Cartao>
        {ortografia.length === 0 ? (
          <Text style={[tipografia.texto, { color: cores.ok }]}>
            Nenhum problema ortográfico comum ou palavra repetida identificada.
          </Text>
        ) : (
          ortografia.map((item, idx) => (
            <View key={`orto_${idx}`} style={styles.bulletRow}>
              <Text style={[tipografia.textoDestaque, { color: cores.erro, marginRight: 8 }]}>
                !
              </Text>
              <Text style={[tipografia.textoMedio, { color: cores.tinta, flex: 1 }]}>
                {item.rotulo}
              </Text>
            </View>
          ))
        )}
      </Cartao>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumoRequisitosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D3DBE340',
    paddingTop: 12,
    marginTop: 8,
  },
  origemAnaliseContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  secaoHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  evidenciaBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
});
