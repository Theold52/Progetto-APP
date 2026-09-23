// Team badge (initials on colored circle) or team logo image if provided.
export function TeamBadge({ name, size = 40, logoUri }: { name: string; size?: number; logoUri?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  const palette = ["#0284C7", "#D4AF37", "#0369A1", "#7C3AED", "#DC2626", "#059669", "#DB2777", "#EA580C"];
  const bg = palette[Math.abs(hash) % palette.length];
  if (logoUri) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          backgroundColor: colors.surfaceTertiary,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <ExpoImage source={{ uri: logoUri }} style={{ width: size, height: size }} contentFit="cover" />
      </View>
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: size * 0.4 }}>{initials || "?"}</Text>
    </View>
  );
}