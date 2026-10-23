import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { Button, NoticeBanner } from '../../../components';
import { fontNames, radius, spacing, tipografia } from '../../../theme';

export interface StudentDashboardScreenProps {
  onIrParaCurriculo: () => void;
  onIrParaVagas: () => void;
  onIrParaDiagnostico: (vagaId?: string) => void;
  onIrParaPlano: (vagaId?: string) => void;
}

export function StudentDashboardScreen({
  onIrParaCurriculo,
  onIrParaVagas,
  onIrParaDiagnostico,
  onIrParaPlano,
}: StudentDashboardScreenProps) {
  const { cores } = useTheme();
  const {
    isCurriculoExemplo,
    analiseCurriculo,
    vagasComDiagnostico,
    vagaSelecionada,
    diagnosticoAtual,
    planoAtual,
    selecionarPerfil,
  } = useAppData();

  const proximaTarefa = useMemo(() => {
    if (!planoAtual) return null;
    return planoAtual.etapas.find((e) => !e.concluida) ?? null;
  }, [planoAtual]);

  const aderenciaDestaque = diagnosticoAtual?.aderencia ?? 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      {/* HERO CENTRALIZADO ESTILO "Conectando profissionais ao mercado certo." (CREA-MA) */}
      <View style={[styles.heroSection, { backgroundColor: cores.superficie, borderBottomColor: cores.linha }]}>
        <View style={[styles.instBadge, { backgroundColor: cores.destaqueSuave }]}>
          <Text style={[styles.instBadgeText, { color: cores.destaque }]}>
            TEIA · UNDB — ENGENHARIA DE SOFTWARE
          </Text>
        </View>

        <Text style={[styles.heroHeading, { color: cores.tinta }]}>
          Conectando{' '}
          <Text style={{ color: cores.laranjaDestaque }}>estudantes</Text>
          {'\n'}ao mercado certo.
        </Text>

        <Text style={[styles.heroSubheading, { color: cores.textoSecundario }]}>
          Programa do TEIA · UNDB que aproxima empresas, estudantes e oportunidades através de
          diagnóstico claro de currículo e plano prático de evolução.
        </Text>

        <Button
          titulo="Analisar meu currículo  ↗"
          onPress={onIrParaCurriculo}
          variante="primario"
          style={styles.heroCtaButton}
        />
      </View>

      <View style={styles.bodyPadding}>
        {isCurriculoExemplo ? (
          <NoticeBanner
            tipo="info"
            mensagem="Currículo de demonstração ativo. Toque em 'Currículo' para colar seu texto ou importar um arquivo .txt."
          />
        ) : null}

        {/* SEÇÃO ROADMAP ESTILO BENTO GRID ("Clareza em cada etapa do processo seletivo!") */}
        <View style={styles.centeredSectionHeader}>
          <Text style={[styles.overlineTag, { color: cores.destaque }]}>ROADMAP</Text>
          <Text style={[styles.sectionMainTitle, { color: cores.tinta }]}>
            Clareza em cada{'\n'}etapa da sua preparação!{' '}
            <Text style={styles.neonStar}>✳</Text>
          </Text>
        </View>

        {/* Bento Card 1: Candidatura / Currículo */}
        <Pressable
          onPress={onIrParaCurriculo}
          style={[
            styles.bentoOuterCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <View
            style={[
              styles.bentoInnerPreview,
              { backgroundColor: cores.superficie, borderColor: cores.linha },
            ]}
          >
            <Text style={[styles.previewTitle, { color: cores.tinta }]}>Meu Currículo</Text>
            <Text style={[styles.previewMuted, { color: cores.textoSecundario }]}>
              {analiseCurriculo.totalPalavras} palavras ·{' '}
              {analiseCurriculo.competenciasReconhecidas.length} competências reconhecidas
            </Text>
            <View style={styles.skeletonBarGroup}>
              <View
                style={[
                  styles.skeletonBar,
                  {
                    width: `${Math.max(25, analiseCurriculo.scorePreparacao)}%`,
                    backgroundColor: cores.destaque,
                  },
                ]}
              />
            </View>
            <View style={styles.miniBlueBtnWrap}>
              <View style={[styles.miniBlueBtn, { backgroundColor: cores.destaque }]}>
                <Text style={styles.miniBlueBtnText}>Editar currículo</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.bentoLabelTitle, { color: cores.tinta }]}>1. Currículo</Text>
          <Text style={[styles.bentoLabelSub, { color: cores.textoSecundario }]}>
            Estruturação de seções, competências e revisão ortográfica
          </Text>
        </Pressable>

        {/* Bento Card 2: Triagem de Vagas */}
        <Pressable
          onPress={onIrParaVagas}
          style={[
            styles.bentoOuterCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <View style={styles.triagemRowPreview}>
            <View
              style={[
                styles.triagemPillBox,
                { backgroundColor: cores.superficie, borderColor: cores.linha },
              ]}
            >
              <Text style={[styles.previewTitle, { color: cores.tinta, fontSize: 13 }]}>
                {vagasComDiagnostico.length} vagas mapeadas
              </Text>
              <View style={[styles.grayLineShort, { backgroundColor: cores.linha }]} />
            </View>

            <View style={[styles.blackSearchCircle, { backgroundColor: cores.tinta }]}>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>⌕</Text>
            </View>
          </View>

          <Text style={[styles.bentoLabelTitle, { color: cores.tinta }]}>2. Triagem de Vagas</Text>
          <Text style={[styles.bentoLabelSub, { color: cores.textoSecundario }]}>
            Extração de requisitos obrigatórios (peso 2) e diferenciais (peso 1)
          </Text>
        </Pressable>

        {/* Bento Card 3: Diagnóstico de Aderência (Estilo Card "Oferta / R$ 18k" do CREA-MA) */}
        <Pressable
          onPress={() => onIrParaDiagnostico(vagaSelecionada?.id)}
          style={[
            styles.bentoOuterCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <View
            style={[
              styles.bentoInnerPreview,
              { backgroundColor: cores.superficie, borderColor: cores.linha },
            ]}
          >
            <Text style={[styles.previewTitle, { color: cores.tinta }]}>Compatibilidade</Text>
            <Text style={[styles.bigOfferMetric, { color: cores.tinta }]}>
              {diagnosticoAtual?.aderencia !== null && diagnosticoAtual?.aderencia !== undefined
                ? `${aderenciaDestaque}%`
                : '—'}
            </Text>
            <Text style={[styles.previewMuted, { color: cores.textoSecundario }]}>
              {diagnosticoAtual?.nivel.rotulo ?? 'Estimativa ponderada'}
            </Text>

            <View
              style={[
                styles.companyMiniBox,
                { backgroundColor: cores.superficieSecundaria, borderColor: cores.linha },
              ]}
            >
              <Text style={{ fontSize: 13, marginRight: 6 }}>🏢</Text>
              <Text
                style={[styles.previewMuted, { color: cores.tinta, fontWeight: '600', flex: 1 }]}
                numberOfLines={1}
              >
                {vagaSelecionada ? vagaSelecionada.titulo : 'Selecione uma vaga'}
              </Text>
            </View>

            <View style={styles.miniBlueBtnWrap}>
              <View style={[styles.miniBlueBtn, { backgroundColor: cores.destaque }]}>
                <Text style={styles.miniBlueBtnText}>Ver diagnóstico</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.bentoLabelTitle, { color: cores.tinta }]}>3. Diagnóstico</Text>
          <Text style={[styles.bentoLabelSub, { color: cores.textoSecundario }]}>
            Evidências encontradas no currículo e requisitos que faltam
          </Text>
        </Pressable>

        {/* Bento Card 4: Plano de Voo */}
        <Pressable
          onPress={() => onIrParaPlano(vagaSelecionada?.id)}
          style={[
            styles.bentoOuterCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <View
            style={[
              styles.bentoInnerPreview,
              { backgroundColor: cores.superficie, borderColor: cores.linha },
            ]}
          >
            <View style={styles.planMiniHeader}>
              <Text style={[styles.previewTitle, { color: cores.tinta }]}>
                Próxima etapa prioritária
              </Text>
              <Text style={[styles.previewMuted, { color: cores.destaque, fontWeight: '700' }]}>
                {planoAtual ? `${planoAtual.concluidasCount}/${planoAtual.totalEtapas}` : '0/0'}
              </Text>
            </View>
            <Text
              style={[styles.previewMuted, { color: cores.textoSecundario, marginTop: 4 }]}
              numberOfLines={2}
            >
              {proximaTarefa
                ? `${proximaTarefa.titulo} — ${proximaTarefa.detalhe}`
                : 'Todas as tarefas desta vaga foram concluídas!'}
            </Text>

            <View style={styles.miniBlueBtnWrap}>
              <View style={[styles.miniBlueBtn, { backgroundColor: cores.destaque }]}>
                <Text style={styles.miniBlueBtnText}>Abrir Plano de Voo</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.bentoLabelTitle, { color: cores.tinta }]}>4. Plano de Voo</Text>
          <Text style={[styles.bentoLabelSub, { color: cores.textoSecundario }]}>
            Checklist interativo e persistido de melhorias e estudos
          </Text>
        </Pressable>

        {/* SEÇÃO "COMO FUNCIONA?" COM OS 3 CARDS COLORIDOS DO CREA-MA (Estudante, Profissional/TEIA, Empresa) */}
        <View style={[styles.centeredSectionHeader, { marginTop: spacing.xl }]}>
          <Text style={[styles.overlineTag, { color: cores.destaque }]}>COMO FUNCIONA?</Text>
          <Text style={[styles.sectionMainTitle, { color: cores.tinta }]}>
            Explore os portais e{'\n'}encontre oportunidades! ✦
          </Text>
        </View>

        {/* Card Colorido 1: Estudante (Azul Royal #0057FF) */}
        <View style={[styles.personaColorCard, { backgroundColor: cores.cardEstudante }]}>
          <Text style={styles.personaTitle}>Estudante</Text>
          <Text style={styles.personaDescription}>
            Construa seu perfil profissional desde o início da graduação, avalie seu currículo e
            siga o Plano de Voo para cada vaga.
          </Text>

          <Pressable
            onPress={onIrParaVagas}
            accessibilityRole="button"
            style={styles.whitePillBtn}
          >
            <Text style={[styles.whitePillBtnText, { color: cores.destaque }]}>
              Ver vagas disponíveis  ↗
            </Text>
          </Pressable>
        </View>

        {/* Card Colorido 2: Coordenação TEIA (Verde Esmeralda #2E9B68) */}
        <View style={[styles.personaColorCard, { backgroundColor: cores.cardProfissional }]}>
          <Text style={styles.personaTitle}>Coordenação TEIA</Text>
          <Text style={styles.personaDescription}>
            Acompanhe os indicadores demonstrativos dos alunos, o ranking de compatibilidade e as
            competências mais demandadas.
          </Text>

          <Pressable
            onPress={() => selecionarPerfil('teia')}
            accessibilityRole="button"
            style={styles.whitePillBtn}
          >
            <Text style={[styles.whitePillBtnText, { color: cores.destaque }]}>
              Acessar painel do TEIA  ↗
            </Text>
          </Pressable>
        </View>

        {/* Card Colorido 3: Empresa (Laranja Coral #EB7A44) */}
        <View style={[styles.personaColorCard, { backgroundColor: cores.cardEmpresa }]}>
          <Text style={styles.personaTitle}>Empresa</Text>
          <Text style={styles.personaDescription}>
            Publique suas vagas, defina a nota de corte mínima e encontre o talento ideal para sua
            organização.
          </Text>

          <Pressable
            onPress={() => selecionarPerfil('empresa')}
            accessibilityRole="button"
            style={styles.whitePillBtn}
          >
            <Text style={[styles.whitePillBtnText, { color: cores.destaque }]}>
              Publicar vaga como empresa  ↗
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 44,
  },
  heroSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  instBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  instBadgeText: {
    fontFamily: fontNames.plexSans600,
    fontSize: 10.5,
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  heroHeading: {
    fontFamily: fontNames.bricolage700,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  heroSubheading: {
    fontFamily: fontNames.plexSans400,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 460,
  },
  heroCtaButton: {
    marginTop: spacing.lg,
    paddingHorizontal: 26,
  },
  bodyPadding: {
    padding: spacing.lg,
  },
  centeredSectionHeader: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  overlineTag: {
    fontFamily: fontNames.plexSans600,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionMainTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  neonStar: {
    color: '#00E640',
    fontWeight: '700',
  },
  bentoOuterCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowColor: '#0A0D14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  bentoInnerPreview: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#0A0D14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    fontFamily: fontNames.bricolage600,
    fontSize: 14,
    fontWeight: '600',
  },
  previewMuted: {
    fontFamily: fontNames.plexSans400,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  skeletonBarGroup: {
    height: 7,
    backgroundColor: '#ECEEF2',
    borderRadius: 999,
    marginTop: 10,
    overflow: 'hidden',
  },
  skeletonBar: {
    height: '100%',
    borderRadius: 999,
  },
  miniBlueBtnWrap: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  miniBlueBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  miniBlueBtnText: {
    color: '#FFFFFF',
    fontFamily: fontNames.plexSans600,
    fontSize: 11.5,
    fontWeight: '600',
  },
  triagemRowPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginBottom: spacing.md,
  },
  triagemPillBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
  },
  grayLineShort: {
    width: '60%',
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  blackSearchCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigOfferMetric: {
    fontFamily: fontNames.bricolage700,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  companyMiniBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  planMiniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bentoLabelTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  bentoLabelSub: {
    fontFamily: fontNames.plexSans400,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 2,
  },
  personaColorCard: {
    borderRadius: 18,
    padding: 22,
    marginBottom: spacing.md,
  },
  personaTitle: {
    color: '#FFFFFF',
    fontFamily: fontNames.bricolage700,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  personaDescription: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontFamily: fontNames.plexSans400,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  whitePillBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitePillBtnText: {
    fontFamily: fontNames.plexSans600,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
