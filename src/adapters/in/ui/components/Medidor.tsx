import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { fontNames, tipografia } from '../theme/typography';

export interface MedidorProps {
  aderencia: number | null; // 0 a 100 ou null
  nivelTexto?: string;
  tamanho?: number;
}

export function Medidor({ aderencia, nivelTexto, tamanho = 220 }: MedidorProps) {
  const { cores } = useTheme();

  const clamped = aderencia === null ? 0 : Math.max(0, Math.min(100, aderencia));
  const raio = 75;
  const cx = 100;
  const cy = 90;
  // Comprimento do arco de meio círculo = PI * raio
  const comprimento = Math.PI * raio;
  const offset = aderencia === null ? comprimento : comprimento * (1 - clamped / 100);

  let corArco = cores.destaque;
  if (aderencia !== null) {
    if (clamped >= 75) {
      corArco = cores.ok;
    } else if (clamped >= 45) {
      corArco = cores.atencao;
    } else {
      corArco = cores.erro;
    }
  }

  const arcPath = `M ${cx - raio} ${cy} A ${raio} ${raio} 0 0 1 ${cx + raio} ${cy}`;

  const rotuloAcessibilidade =
    aderencia === null
      ? 'Aderência não calculada, sem requisitos reconhecidos'
      : `Medidor de aderência: ${clamped}%, ${nivelTexto || ''}`;

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={rotuloAcessibilidade}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <Svg
        width={tamanho}
        height={tamanho * 0.58}
        viewBox="0 0 200 115"
        style={styles.svg}
      >
        {/* Arco de fundo (trilho) */}
        <Path
          d={arcPath}
          fill="none"
          stroke={cores.linha}
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Arco preenchido com a porcentagem */}
        {aderencia !== null && clamped > 0 && (
          <Path
            d={arcPath}
            fill="none"
            stroke={corArco}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${comprimento} ${comprimento}`}
            strokeDashoffset={offset}
          />
        )}

        {/* Marca 0 */}
        <SvgText
          x={cx - raio - 6}
          y={cy + 18}
          fontSize="10"
          fill={cores.textoSecundario}
          fontFamily={fontNames.plexMono400}
          textAnchor="middle"
        >
          0
        </SvgText>

        {/* Marca 100 */}
        <SvgText
          x={cx + raio + 6}
          y={cy + 18}
          fontSize="10"
          fill={cores.textoSecundario}
          fontFamily={fontNames.plexMono400}
          textAnchor="middle"
        >
          100
        </SvgText>
      </Svg>

      {/* Conteúdo central (porcentagem e nível) */}
      <View style={styles.centerTextContainer}>
        <Text
          style={[
            tipografia.tituloTela,
            {
              color: cores.tinta,
              fontSize: 34,
              lineHeight: 38,
            },
          ]}
        >
          {aderencia === null ? '—' : `${clamped}%`}
        </Text>
        {nivelTexto ? (
          <Text
            style={[
              tipografia.rotulo,
              {
                color: corArco,
                marginTop: 2,
              },
            ]}
          >
            {nivelTexto}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  svg: {
    alignSelf: 'center',
  },
  centerTextContainer: {
    position: 'absolute',
    top: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
