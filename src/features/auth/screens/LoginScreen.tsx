import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { Button, Card, Input } from '../../../components';
import { PerfilUsuario } from '../../../domain';
import { fontNames, radius, spacing, tipografia } from '../../../theme';

interface OpcaoPerfilLogin {
  id: PerfilUsuario;
  titulo: string;
  subtitulo: string;
  icone: string;
  emailPadrao: string;
  corDestaque: string;
}

const PERFIS_LOGIN: OpcaoPerfilLogin[] = [
  {
    id: 'aluno',
    titulo: 'Estudante',
    subtitulo: 'Currículo, vagas, diagnóstico e plano de evolução',
    icone: '🎓',
    emailPadrao: 'estudante@undb.edu.br',
    corDestaque: '#0057FF',
  },
  {
    id: 'empresa',
    titulo: 'Empresa Parceira',
    subtitulo: 'Publicação de vagas e triagem por nota de corte',
    icone: '🏢',
    emailPadrao: 'recrutamento@empresa.com.br',
    corDestaque: '#EB7A44',
  },
  {
    id: 'teia',
    titulo: 'Coordenação TEIA',
    subtitulo: 'Indicadores institucionais e ranking de aderência',
    icone: '⚡',
    emailPadrao: 'coordenacao.teia@undb.edu.br',
    corDestaque: '#2E9B68',
  },
];

export function LoginScreen() {
  const { cores, isDark, alternarTema } = useTheme();
  const { perfil, entrarComPerfil } = useAppData();

  const [perfilEscolhido, setPerfilEscolhido] = useState<PerfilUsuario>(perfil || 'aluno');
  const [email, setEmail] = useState<string>(() => {
    const atual = PERFIS_LOGIN.find((p) => p.id === (perfil || 'aluno'));
    return atual?.emailPadrao ?? 'estudante@undb.edu.br';
  });
  const [senha, setSenha] = useState<string>('123456');

  const opcaoAtiva =
    PERFIS_LOGIN.find((p) => p.id === perfilEscolhido) ?? PERFIS_LOGIN[0];

  const handleTrocarPerfil = (novo: OpcaoPerfilLogin) => {
    setPerfilEscolhido(novo.id);
    setEmail(novo.emailPadrao);
  };

  const handleEntrar = async () => {
    await entrarComPerfil(perfilEscolhido);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: cores.fundo }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top bar simples com alternador de tema */}
        <View style={styles.topRow}>
          <View style={[styles.tagPill, { backgroundColor: cores.destaqueSuave }]}>
            <Text style={[styles.tagPillText, { color: cores.destaque }]}>
              TEIA · UNDB
            </Text>
          </View>

          <Pressable
            onPress={alternarTema}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            style={[
              styles.themeBtn,
              { backgroundColor: cores.superficie, borderColor: cores.linha },
            ]}
          >
            <Text style={[styles.themeBtnText, { color: cores.tinta }]}>
              {isDark ? '☀ Claro' : '☾ Escuro'}
            </Text>
          </Pressable>
        </View>

        {/* Marca / Cabeçalho limpo */}
        <View style={styles.brandSection}>
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: '#FFEBF1', borderColor: '#D91A5B' },
            ]}
          >
            <Text style={styles.logoIcon}>✈</Text>
          </View>
          <Text style={[styles.appTitle, { color: cores.tinta }]}>Plano de Voo</Text>
          <Text style={[styles.appSubtitle, { color: cores.textoSecundario }]}>
            Selecione o perfil de acesso para continuar
          </Text>
        </View>

        {/* Seleção de Perfil (3 cartões limpos e separados) */}
        <View style={styles.profilesList}>
          {PERFIS_LOGIN.map((item) => {
            const selecionado = item.id === perfilEscolhido;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleTrocarPerfil(item)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selecionado }}
                accessibilityLabel={`Perfil ${item.titulo}`}
                style={[
                  styles.profileCard,
                  {
                    backgroundColor: cores.superficie,
                    borderColor: selecionado ? cores.destaque : cores.linha,
                    borderWidth: selecionado ? 2 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.profileIconWrap,
                    {
                      backgroundColor: selecionado
                        ? cores.destaqueSuave
                        : cores.superficieSecundaria,
                    },
                  ]}
                >
                  <Text style={styles.profileEmoji}>{item.icone}</Text>
                </View>

                <View style={styles.profileTextCol}>
                  <Text style={[styles.profileTitle, { color: cores.tinta }]}>
                    {item.titulo}
                  </Text>
                  <Text
                    style={[styles.profileDesc, { color: cores.textoSecundario }]}
                    numberOfLines={1}
                  >
                    {item.subtitulo}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor: selecionado ? cores.destaque : cores.linha,
                    },
                  ]}
                >
                  {selecionado ? (
                    <View
                      style={[
                        styles.radioInner,
                        { backgroundColor: cores.destaque },
                      ]}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Credenciais de acesso */}
        <Card style={styles.loginFormCard}>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 10 }]}>
            ACESSO · {opcaoAtiva.titulo.toUpperCase()}
          </Text>

          <Input
            rotulo="E-MAIL"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            rotulo="SENHA"
            placeholder="••••••"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Button
            titulo={`Entrar como ${opcaoAtiva.titulo}  →`}
            onPress={handleEntrar}
            variante="primario"
            style={{ marginTop: 4 }}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 36,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tagPillText: {
    fontFamily: fontNames.plexSans600,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  themeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  themeBtnText: {
    fontFamily: fontNames.plexSans600,
    fontSize: 11.5,
    fontWeight: '600',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoIcon: {
    color: '#D91A5B',
    fontSize: 20,
    fontWeight: '700',
  },
  appTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  appSubtitle: {
    fontFamily: fontNames.plexSans400,
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 4,
    textAlign: 'center',
  },
  profilesList: {
    gap: 10,
    marginBottom: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
  },
  profileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileEmoji: {
    fontSize: 18,
  },
  profileTextCol: {
    flex: 1,
    marginRight: 8,
  },
  profileTitle: {
    fontFamily: fontNames.bricolage600,
    fontSize: 15,
    fontWeight: '600',
  },
  profileDesc: {
    fontFamily: fontNames.plexSans400,
    fontSize: 12,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  loginFormCard: {
    padding: spacing.md,
    marginBottom: 0,
  },
});
