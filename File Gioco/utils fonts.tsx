import { useFonts } from "expo-font";
import { Text } from "react-native";

export function useAppFonts() {
  const [loaded] = useFonts({
    "Barlow-Regular": require("../../assets/fonts/Barlow-Regular.ttf"),
    "Barlow-Medium": require("../../assets/fonts/Barlow-Medium.ttf"),
    "Barlow-SemiBold": require("../../assets/fonts/Barlow-SemiBold.ttf"),
    "Barlow-Bold": require("../../assets/fonts/Barlow-Bold.ttf"),
    "Barlow-Black": require("../../assets/fonts/Barlow-Black.ttf"),
  });
  return loaded;
}

// Map RN Text `fontWeight` values to our Barlow variants.
const weightToFamily: Record<string, string> = {
  "100": "Barlow-Regular",
  "200": "Barlow-Regular",
  "300": "Barlow-Regular",
  normal: "Barlow-Regular",
  "400": "Barlow-Regular",
  "500": "Barlow-Medium",
  "600": "Barlow-SemiBold",
  "700": "Barlow-Bold",
  bold: "Barlow-Bold",
  "800": "Barlow-Black",
  "900": "Barlow-Black",
};

let applied = false;
export function applyGlobalFont() {
  if (applied) return;
  applied = true;
  const anyText = Text as any;
  const origRender = anyText.render;
  anyText.defaultProps = anyText.defaultProps || {};
  const baseStyle = { fontFamily: "Barlow-Regular" };
  // Merge default style
  anyText.defaultProps.style = [baseStyle, anyText.defaultProps.style];

  if (origRender) {
    anyText.render = function (...args: unknown[]) {
      const origin = origRender.call(this, ...args);
      const props = origin.props || {};
      const flat = Array.isArray(props.style) ? Object.assign({}, ...props.style.filter(Boolean)) : props.style || {};
      const weight = flat.fontWeight;
      const family =
        flat.fontFamily || (weight && weightToFamily[String(weight)]) || "Barlow-Regular";
      return {
        ...origin,
        props: {
          ...props,
          style: [{ fontFamily: family }, props.style],
        },
      };
    };
  }
}
