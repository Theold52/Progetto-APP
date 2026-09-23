import React from "react";
import Svg, {
  ClipPath,
  Defs,
  G,
  Path,
  Rect,
  Circle,
  Line,
  Polygon,
} from "react-native-svg";
import type { Kit } from "../types";

// Shirt silhouette path (approx 100x120 viewBox).
const SHIRT_PATH =
  "M20 15 L35 8 L45 12 L55 12 L65 8 L80 15 L92 22 L86 40 L74 34 L74 108 L26 108 L26 34 L14 40 L8 22 Z";

function StripedVertical({ c1, c2, count = 6 }: { c1: string; c2: string; count?: number }) {
  const stripes = [];
  const w = 100 / count;
  for (let i = 0; i < count; i++) {
    stripes.push(<Rect key={i} x={i * w} y={0} width={w} height={120} fill={i % 2 === 0 ? c1 : c2} />);
  }
  return <>{stripes}</>;
}

function StripedHorizontal({ c1, c2, count = 6 }: { c1: string; c2: string; count?: number }) {
  const stripes = [];
  const h = 120 / count;
  for (let i = 0; i < count; i++) {
    stripes.push(<Rect key={i} x={0} y={i * h} width={100} height={h} fill={i % 2 === 0 ? c1 : c2} />);
  }
  return <>{stripes}</>;
}

function Checker({ c1, c2, size = 12 }: { c1: string; c2: string; size?: number }) {
  const cells = [];
  const cols = Math.ceil(100 / size);
  const rows = Math.ceil(120 / size);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <Rect
          key={`${r}-${c}`}
          x={c * size}
          y={r * size}
          width={size}
          height={size}
          fill={(r + c) % 2 === 0 ? c1 : c2}
        />,
      );
    }
  }
  return <>{cells}</>;
}

function Pattern({ idx, kit }: { idx: number; kit: Kit }) {
  const { primary, secondary, accent } = kit;
  switch (idx % 30) {
    case 0:
      return <Rect x={0} y={0} width={100} height={120} fill={primary} />;
    case 1:
      return <StripedVertical c1={primary} c2={secondary} count={6} />;
    case 2:
      return <StripedVertical c1={primary} c2={secondary} count={10} />;
    case 3:
      return <StripedHorizontal c1={primary} c2={secondary} count={6} />;
    case 4:
      return <StripedHorizontal c1={primary} c2={secondary} count={10} />;
    case 5:
      return <Checker c1={primary} c2={secondary} size={12} />;
    case 6:
      return <Checker c1={primary} c2={secondary} size={20} />;
    case 7:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Polygon points="0,0 100,0 100,120" fill={secondary} />
        </>
      );
    case 8:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Polygon points="0,40 100,10 100,40 0,70" fill={secondary} />
          <Polygon points="0,68 100,38 100,44 0,74" fill={accent} />
        </>
      );
    case 9:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Rect x={35} y={0} width={30} height={120} fill={secondary} />
        </>
      );
    case 10:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Rect x={25} y={0} width={12} height={120} fill={secondary} />
          <Rect x={63} y={0} width={12} height={120} fill={accent} />
        </>
      );
    case 11:
      return (
        <>
          <Rect x={0} y={0} width={50} height={120} fill={primary} />
          <Rect x={50} y={0} width={50} height={120} fill={secondary} />
        </>
      );
    case 12:
      return (
        <>
          <Rect x={0} y={0} width={100} height={60} fill={primary} />
          <Rect x={0} y={60} width={100} height={60} fill={secondary} />
        </>
      );
    case 13: {
      const dots: React.ReactNode[] = [];
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 8; c++) {
          dots.push(
            <Circle
              key={`${r}-${c}`}
              cx={c * 14 + (r % 2 ? 7 : 0) + 4}
              cy={r * 14 + 6}
              r={2.5}
              fill={secondary}
            />,
          );
        }
      }
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          {dots}
        </>
      );
    }
    case 14: {
      const shapes: React.ReactNode[] = [];
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
          const x = c * 22 + (r % 2 ? 11 : 0);
          const y = r * 22;
          shapes.push(
            <Polygon
              key={`a-${r}-${c}`}
              points={`${x + 11},${y} ${x + 22},${y + 11} ${x + 11},${y + 22} ${x},${y + 11}`}
              fill={(r + c) % 2 === 0 ? secondary : accent}
            />,
          );
        }
      }
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          {shapes}
        </>
      );
    }
    case 15:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Polygon points="0,20 50,50 100,20 100,40 50,70 0,40" fill={secondary} />
          <Polygon points="0,70 50,100 100,70 100,90 50,120 0,90" fill={secondary} />
        </>
      );
    case 16:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Rect x={45} y={0} width={10} height={120} fill={secondary} />
          <Rect x={0} y={55} width={100} height={10} fill={secondary} />
        </>
      );
    case 17:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Polygon points="0,0 20,0 50,60 80,0 100,0 60,80 40,80" fill={secondary} />
        </>
      );
    case 18:
      return <StripedHorizontal c1={primary} c2={secondary} count={16} />;
    case 19:
      return <StripedVertical c1={primary} c2={secondary} count={20} />;
    case 20:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Polygon
              key={i}
              points={`${i * 20},0 ${i * 20 + 20},0 ${i * 20 + 10},30`}
              fill={i % 2 === 0 ? secondary : accent}
            />
          ))}
        </>
      );
    case 21:
      return (
        <>
          <Rect x={0} y={0} width={100} height={40} fill={primary} />
          <Rect x={0} y={40} width={100} height={40} fill={secondary} />
          <Rect x={0} y={80} width={100} height={40} fill={accent} />
        </>
      );
    case 22:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Polygon points="0,20 30,0 100,60 100,80 70,100 0,40" fill={secondary} />
        </>
      );
    case 23:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Rect x={0} y={0} width={100} height={30} fill={secondary} />
        </>
      );
    case 24:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Polygon points="0,0 30,0 0,50" fill={secondary} />
          <Polygon points="100,0 70,0 100,50" fill={secondary} />
        </>
      );
    case 25:
      return <Checker c1={primary} c2={secondary} size={24} />;
    case 26:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          {[0, 1, 2, 3].map((i) => (
            <Polygon
              key={i}
              points={`${i * 25 + 12},55 ${i * 25 + 25},65 ${i * 25 + 12},75 ${i * 25},65`}
              fill={secondary}
            />
          ))}
        </>
      );
    case 27:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <Line
              key={deg}
              x1={50}
              y1={60}
              x2={50 + 80 * Math.cos((deg * Math.PI) / 180)}
              y2={60 + 80 * Math.sin((deg * Math.PI) / 180)}
              stroke={secondary}
              strokeWidth={5}
            />
          ))}
        </>
      );
    case 28:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          {[20, 50, 80].map((y) => (
            <Path
              key={y}
              d={`M0 ${y} Q25 ${y - 10} 50 ${y} T100 ${y}`}
              stroke={secondary}
              strokeWidth={6}
              fill="none"
            />
          ))}
        </>
      );
    case 29:
      return (
        <>
          <Rect x={0} y={0} width={100} height={120} fill={primary} />
          <Circle cx={25} cy={30} r={18} fill={secondary} />
          <Circle cx={70} cy={50} r={22} fill={accent} />
          <Circle cx={40} cy={85} r={16} fill={accent} />
          <Circle cx={80} cy={95} r={14} fill={secondary} />
        </>
      );
    default:
      return <Rect x={0} y={0} width={100} height={120} fill={primary} />;
  }
}

let clipCounter = 0;

export function ShirtIcon({ kit, size = 64 }: { kit: Kit; size?: number }) {
  const clipId = React.useMemo(() => `clip-shirt-${++clipCounter}`, []);
  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      <Defs>
        <ClipPath id={clipId}>
          <Path d={SHIRT_PATH} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clipId})`}>
        <Pattern idx={kit.pattern} kit={kit} />
      </G>
      <Path d={SHIRT_PATH} fill="none" stroke={kit.accent} strokeWidth={2.2} />
      <Path d="M45 12 L50 22 L55 12" fill="none" stroke={kit.accent} strokeWidth={2.2} />
    </Svg>
  );
}

export function KitPreview({ kit, size = 90 }: { kit: Kit; size?: number }) {
  const clipId = React.useMemo(() => `clip-full-${++clipCounter}`, []);
  const shortsColor = kit.secondary;
  const socksColor = kit.accent;
  const w = size;
  return (
    <Svg width={w} height={w * 1.65} viewBox="0 0 100 160">
      <Defs>
        <ClipPath id={clipId}>
          <Path d={SHIRT_PATH} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clipId})`}>
        <Pattern idx={kit.pattern} kit={kit} />
      </G>
      <Path d={SHIRT_PATH} fill="none" stroke={kit.accent} strokeWidth={2.2} />
      <Path d="M45 12 L50 22 L55 12" fill="none" stroke={kit.accent} strokeWidth={2.2} />
      <Path
        d="M28 108 L72 108 L74 135 L54 137 L50 118 L46 137 L26 135 Z"
        fill={shortsColor}
        stroke={kit.accent}
        strokeWidth={2}
      />
      <Rect x={30} y={140} width={16} height={16} fill={socksColor} stroke={kit.accent} strokeWidth={1.5} />
      <Rect x={54} y={140} width={16} height={16} fill={socksColor} stroke={kit.accent} strokeWidth={1.5} />
    </Svg>
  );
}
