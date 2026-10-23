import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { checkServerHealth, getApiBaseUrl, setApiBaseUrl } from '../../data/api/apiConfig';
import { fontNames, radius, spacing, tipografia } from '../../theme';
import { Button } from './Button';

export interface VpsConnectionModalProps {
  visivel: boolean;
  aoFechar: () => void;
  aoConectarSucesso?: () => void;
}

export function VpsConnectionModal({
  visivel,
  aoFechar,
  aoConectarSucesso,
}: VpsConnectionModalProps) {
  const { cores } = useTheme();
  const [url, setUrl] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [status, setStatus] = useState<{
    testado: boolean;
    online: boolean;
    mensagem: string;
  }>({ testado: false, online: false, mensagem: '' });

  useEffect(() => {
    if (visivel) {
      getApiBaseUrl().then((savedUrl) => {
        setUrl(savedUrl);
        testarConexaoRapida(savedUrl);
      });
    }
  }, [visivel]);

  async function testarConexaoRapida(targetUrl: string) {
    if (!targetUrl) return;
    setCarregando(true);
    const resultado = await checkServerHealth(targetUrl);
    setCarregando(false);
    setStatus({
      testado: true,
      online: resultado.online,
      mensagem: resultado.online
        ? 'Banco PostgreSQL conectado com sucesso!'
        : `Não foi possível conectar: ${resultado.error || 'Verifique o IP e a porta 3000'}`,
    });
  }

  async function handleSalvar() {
    setCarregando(true);
    const resultado = await checkServerHealth(url);
    setCarregando(false);

    if (resultado.online) {
      await setApiBaseUrl(url);
      setStatus({
        testado: true,
        online: true,
        mensagem: 'Conexão salva! Dados sincronizados com a VPS.',
      });
      if (aoConectarSucesso) aoConectarSucesso();
      setTimeout(aoFechar, 1200);
    } else {
      setStatus({
        testado: true,
        online: false,
        mensagem: `Falha ao conectar: ${resultado.error || 'Servidor inacessível'}. Verifique se o Docker está rodando na VPS.`,
      });
    }
  }

  async function handleUsarLocal() {
    await setApiBaseUrl(null);
    setUrl('http://localhost:3000');
    setStatus({
      testado: true,
      online: true,
      mensagem: 'Alternado para banco local offline.',
    });
    if (aoConectarSucesso) aoConectarSucesso();
    setTimeout(aoFechar, 1000);
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: cores.tinta }]}>
                Conexão com PostgreSQL (VPS)
              </Text>
              <Text style={[styles.subtitle, { color: cores.textoSecundario }]}>
                Conecte o aplicativo à sua VPS na nuvem
              </Text>
            </View>
            <Pressable onPress={aoFechar} hitSlop={12} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: cores.textoSecundario }]}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            <Text style={[styles.label, { color: cores.tinta }]}>URL da API na VPS</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: cores.fundo,
                  borderColor: cores.linha,
                  color: cores.tinta,
                },
              ]}
              value={url}
              onChangeText={setUrl}
              placeholder="http://192.168.1.100:3000 ou http://ip_vps:3000"
              placeholderTextColor={cores.textoSecundario}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {carregando ? (
              <View style={styles.statusBox}>
                <ActivityIndicator color={cores.destaque} size="small" />
                <Text style={[styles.statusText, { color: cores.textoSecundario }]}>
                  Testando conexão com PostgreSQL...
                </Text>
              </View>
            ) : status.testado ? (
              <View
                style={[
                  styles.statusBox,
                  {
                    backgroundColor: status.online
                      ? cores.okSuave
                      : cores.atencaoSuave,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: status.online ? cores.ok : cores.atencao,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {status.online ? '🟢 ' : '🔴 '}
                  {status.mensagem}
                </Text>
              </View>
            ) : null}

            <View style={styles.hintBox}>
              <Text style={[styles.hintText, { color: cores.textoSecundario }]}>
                💡 Execute <Text style={styles.bold}>docker compose up -d</Text> na pasta{' '}
                <Text style={styles.bold}>server/</Text> da sua VPS para iniciar o banco e a API.
              </Text>
            </View>

            <View style={styles.actions}>
              <Button
                titulo="Testar e Salvar Conexão"
                onPress={handleSalvar}
                variante="primario"
                desabilitado={carregando}
              />
              <Button
                titulo="Usar Modo Local Offline"
                onPress={handleUsarLocal}
                variante="padrao"
                style={{ marginTop: spacing.sm }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 29, 62, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    ...tipografia.subtitulo,
    fontFamily: fontNames.bricolage700,
  },
  subtitle: {
    ...tipografia.legenda,
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    gap: spacing.sm,
  },
  label: {
    ...tipografia.rotulo,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    fontFamily: fontNames.plexSans400,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  statusText: {
    ...tipografia.legenda,
    flex: 1,
  },
  hintBox: {
    marginTop: spacing.xs,
  },
  hintText: {
    ...tipografia.legenda,
    fontSize: 12,
  },
  bold: {
    fontWeight: '700',
  },
  actions: {
    marginTop: spacing.md,
  },
});
