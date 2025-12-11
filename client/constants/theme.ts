import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: "#2DD4BF",
    link: "#2DD4BF",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F2F2F2",
    backgroundSecondary: "#E6E6E6",
    backgroundTertiary: "#D9D9D9",
    primary: "#2DD4BF",
    accent: "#6EE7B7",
    surface: "#F2F2F2",
    surfaceElevated: "#E6E6E6",
  },
  dark: {
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#2DD4BF",
    link: "#2DD4BF",
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#334155",
    backgroundTertiary: "#404244",
    primary: "#2DD4BF",
    accent: "#6EE7B7",
    surface: "#1E293B",
    surfaceElevated: "#334155",
  },
};

export const KoiColors = {
  primary: "#2DD4BF",
  deepSea: "#1E3A8A",
  seafoam: "#6EE7B7",
  glacier: "#67E8F9",
  foggy: "#6366F1",
  clear: "#2DD4BF",
  streak: "#34D399",
  koiOrange: "#F97316",
  koiWhite: "#FAFAFA",
  koiBlack: "#1E293B",
  koiPink: "#FB7185",
};

export const ThemePresets = {
  koiPond: {
    name: "Koi Pond",
    waterColor: "#2DD4BF",
    secondaryColor: "#0D9488",
    koiColor: "#F97316",
    particleColor: "#6EE7B7",
  },
  deepSea: {
    name: "Deep Sea",
    waterColor: "#1E3A8A",
    secondaryColor: "#1E40AF",
    koiColor: "#67E8F9",
    particleColor: "#A5F3FC",
  },
  rainyWindow: {
    name: "Rainy Window",
    waterColor: "#475569",
    secondaryColor: "#64748B",
    koiColor: "#94A3B8",
    particleColor: "#CBD5E1",
  },
  tidePool: {
    name: "Tide Pool",
    waterColor: "#6EE7B7",
    secondaryColor: "#34D399",
    koiColor: "#F97316",
    particleColor: "#A7F3D0",
  },
  glacierLake: {
    name: "Glacier Lake",
    waterColor: "#67E8F9",
    secondaryColor: "#22D3EE",
    koiColor: "#FAFAFA",
    particleColor: "#CFFAFE",
  },
  zenRiver: {
    name: "Zen River",
    waterColor: "#4ADE80",
    secondaryColor: "#22C55E",
    koiColor: "#F97316",
    particleColor: "#86EFAC",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 3,
  },
  floatingWeb: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};
