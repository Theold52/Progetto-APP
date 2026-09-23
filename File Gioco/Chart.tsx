import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { colors } from "../theme";

export type LineSeries = {
  color: string;
  label: string;
  values: number[];
};

// Line chart with multiple series (0-30 y-range fixed for stat evolution).
export function StatLineChart({
  labels,
  series,
  height = 180,
  yMax = 30,
}: {
  labels: string[];
  series: LineSeries[];
  height?: number;
  yMax?: number;
}) {
  const [width, setWidth] = React.useState(320);
  const padL = 32;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const chartW = Math.max(1, width - padL - padR);
  const chartH = height - padT - padB;
  const n = labels.length;
  const stepX = n > 1 ? chartW / (n - 1) : chartW;

  const xAt = (i: number) => padL + i * stepX;
  const yAt = (v: number) => padT + chartH - (Math.max(0, Math.min(yMax, v)) / yMax) * chartH;

  const yTicks = [0, Math.round(yMax / 2), yMax];

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Svg width="100%" height={height}>
        {/* Y grid */}
        {yTicks.map((t) => (
          <React.Fragment key={t}>
            <Line
              x1={padL}
              y1={yAt(t)}
              x2={padL + chartW}
              y2={yAt(t)}
              stroke={colors.divider}
              strokeWidth={1}
            />
            <SvgText
              x={padL - 6}
              y={yAt(t) + 4}
              fontSize={10}
              fill={colors.muted}
              textAnchor="end"
            >
              {t}
            </SvgText>
          </React.Fragment>
        ))}
        {/* X labels */}
        {labels.map((lb, i) => (
          <SvgText
            key={i}
            x={xAt(i)}
            y={height - 8}
            fontSize={10}
            fill={colors.muted}
            textAnchor="middle"
          >
            {lb}
          </SvgText>
        ))}
        {/* Series */}
        {series.map((s) => {
          if (s.values.length === 0) return null;
          const d = s.values
            .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`)
            .join(" ");
          return (
            <React.Fragment key={s.label}>
              <Path d={d} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" />
              {s.values.map((v, i) => (
                <Circle key={i} cx={xAt(i)} cy={yAt(v)} r={3.5} fill={s.color} />
              ))}
            </React.Fragment>
          );
        })}
      </Svg>
      {/* Legend */}
      <View style={styles.legend}>
        {series.map((s) => (
          <View key={s.label} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: s.color }]} />
            <Text style={styles.legendText}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 4,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendSwatch: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: "600" },
});
