import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { Badge, ProgressBar } from '../../../components';
import { radius, spacing, tipografia } from '../../../theme';

export interface AdherenceMeterProps {
  aderencia: number | null;
  nivelRotulo: string;
  requisitosAtendidos: number;
  totalRequisitos: number;
}

export function AdherenceMeter({
  aderencia,
  nivelRotulo,
  requisitosAtendidos,
  totalRequisitos,
}: AdherenceMeterProps) {
  const { cores } = useTheme();

  const getCor = () => {
    if (aderencia === null) return cores.textoSecundario;
    if (aderencia >= 75) return cores.ok;
    if (aderencia >= 45) return cores.destaque;
    return cores.atencao;
  };

  const getBadgeVariant = (): 'ok' | 'destaque' | 'atencao' | 'padrao' => {
    if (aderencia === null) return 'padrao';
    if (aderencia >= 75) return 'ok';
    if (aderencia >= 45) return 'destaque';
    return 'atencao';
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.scoreBlock}>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            ESTIMATIVA DE COMPATIBILIDADE
          </Text>
          <View style={styles.scoreValueRow}>
            <Text style={[tipografia.monoDestaque, { color: getCor() }]}>
              {aderencia !== null ? `${aderencia}%` : '—'}
            </Text>
            <Badge
              rotulo={nivelRotulo}
              variante={getBadgeVariant()}
              style={{ marginLeft: spacing.sm }}
            />
          </View>
        </View>

        <View style={styles.counterBox}>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            REQUISITOS
          </Text>
          <Text style={[tipografia.monoValor, { color: cores.tinta, marginTop: 2 }]}>
            {requisitosAtendidos}/{totalRequisitos}
          </Text>
        </View>
      </View>

      <ProgressBar
        progresso={aderencia ?? 0}
        cor={getCor()}
        altura={10}
        style={{ marginTop: spacing.sm, marginBottom: spacing.sm }}
      />

      <View
        style={[
          styles.academicNote,
          {
            backgroundColor: cores.superficieSecundaria,
            borderColor: cores.linha,
          },
        ]}
      >
        <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
          Nota calculada de forma ponderada sobre os requisitos identificados na vaga (peso 2 para
          obrigatórios e peso 1 para diferenciais). Trata-se de uma estimativa de aderência textual,
          e não uma probabilidade de contratação.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  counterBox: {
    alignItems: 'flex-end',
  },
  academicNote: {
    marginTop: 4,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
});
