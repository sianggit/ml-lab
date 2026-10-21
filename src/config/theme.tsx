// theme.tsx
import { createTheme, ThemeOptions, Theme } from "@mui/material/styles";

// Fonts — configured with Next.js font variables fallback to system typography
const fontPrimary = `var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
const fontMono = `var(--font-mono), 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace`;

export const getThemeOptions = (mode: "dark" | "light" = "dark"): ThemeOptions => {
    const isDark = mode === "dark";

    return {
        palette: {
            mode,
            primary: isDark
                ? {
                      main: "#38BDF8", // Clean Steel Blue
                      light: "#7DD3FC",
                      dark: "#0284C7",
                      contrastText: "#090B0E",
                  }
                : {
                      main: "#0284C7", // Sharp Sky Blue
                      light: "#38BDF8",
                      dark: "#0369A1",
                      contrastText: "#FFFFFF",
                  },
            secondary: isDark
                ? {
                      main: "#00F59B", // Emerald Glow / Laser Mint Execution Accent
                      light: "#5CFFC1",
                      dark: "#00C27A",
                      contrastText: "#090B0E",
                  }
                : {
                      main: "#059669", // Rich Emerald Execution Accent
                      light: "#34D399",
                      dark: "#047857",
                      contrastText: "#FFFFFF",
                  },
            background: isDark
                ? {
                      default: "#090B0E", // Tactical Blueprint Canvas
                      paper: "#0F1319", // Workspace Panels & Master Cards
                  }
                : {
                      default: "#F8FAFC", // Crisp Technical Paper
                      paper: "#FFFFFF", // Crisp White Elevated Panels
                  },
            text: isDark
                ? {
                      primary: "#EDEDED", // Solid Crisp Chalk White
                      secondary: "#8A94A6", // High-Contrast Muted Secondary Slate
                      disabled: "#4B5563",
                  }
                : {
                      primary: "#0F172A", // Deep Slate 900
                      secondary: "#475569", // Slate 600
                      disabled: "#94A3B8",
                  },
            divider: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
            info: {
                main: isDark ? "#38BDF8" : "#0284C7",
                light: "#7DD3FC",
                dark: "#0369A1",
            },
            warning: {
                main: "#F59E0B", // Refined Amber Bronze / XP HUD
                light: "#FBBF24",
                dark: "#D97706",
            },
            error: {
                main: isDark ? "#F43F5E" : "#E11D48",
                light: "#FB7185",
                dark: "#BE123C",
            },
            success: {
                main: isDark ? "#00F59B" : "#059669",
                light: "#34D399",
                dark: "#047857",
            },
        },
        typography: {
            fontFamily: fontPrimary,
            allVariants: {
                letterSpacing: "-0.015em",
                fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            },
            h1: {
                fontFamily: fontPrimary,
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                color: isDark ? "#EDEDED" : "#0F172A",
            },
            h2: {
                fontFamily: fontPrimary,
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                color: isDark ? "#EDEDED" : "#0F172A",
            },
            h3: {
                fontFamily: fontPrimary,
                fontWeight: 700,
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                color: isDark ? "#EDEDED" : "#0F172A",
            },
            h4: {
                fontFamily: fontPrimary,
                fontWeight: 600,
                fontSize: "1.25rem",
                letterSpacing: "-0.015em",
                lineHeight: 1.4,
                color: isDark ? "#EDEDED" : "#0F172A",
            },
            h5: {
                fontFamily: fontPrimary,
                fontWeight: 600,
                fontSize: "1.1rem",
                lineHeight: 1.4,
                color: isDark ? "#EDEDED" : "#0F172A",
            },
            h6: {
                fontFamily: fontPrimary,
                fontWeight: 600,
                fontSize: "0.95rem",
                lineHeight: 1.4,
                color: isDark ? "#EDEDED" : "#0F172A",
            },
            subtitle1: {
                fontFamily: fontPrimary,
                fontSize: "1rem",
                lineHeight: 1.5,
                color: isDark ? "#8A94A6" : "#475569",
            },
            subtitle2: {
                fontFamily: fontPrimary,
                fontSize: "0.875rem",
                fontWeight: 500,
                lineHeight: 1.5,
                color: isDark ? "#8A94A6" : "#475569",
            },
            body1: {
                fontFamily: fontPrimary,
                fontSize: "0.95rem",
                lineHeight: 1.65,
                color: isDark ? "#EDEDED" : "#0F172A",
            },
            body2: {
                fontFamily: fontPrimary,
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: isDark ? "#8A94A6" : "#475569",
            },
            button: {
                fontFamily: fontPrimary,
                textTransform: "none",
                fontWeight: 600,
            },
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: `
            /* Reset & Base HTML handled in globals.css with CSS variables */
            *, *::before, *::after {
              box-sizing: border-box;
            }

            /* Monospace Code & Tabular Numbers */
            code, pre, kbd, samp {
              font-family: ${fontMono} !important;
              font-variant-numeric: tabular-nums;
            }

            /* Tactile Hairline Scrollbar */
            * {
              scrollbar-width: thin;
              scrollbar-color: var(--ml-scrollbar-thumb) transparent;
            }
            ::-webkit-scrollbar {
              width: 5px;
              height: 3px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: var(--ml-scrollbar-thumb);
              border-radius: 9999px;
              transition: background-color 0.2s ease;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: var(--ml-acc);
            }

            /* Surface Elevation Hierarchy */
            .workspace-shell {
              background: var(--ml-bg);
            }
            .workspace-panel {
              background: var(--ml-panel);
              border: 1px solid var(--ml-line);
              border-radius: 8px;
            }
            .workspace-panel:hover {
              box-shadow: ${isDark ? "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 24px -4px rgba(0, 0, 0, 0.6)" : "0 8px 24px -4px rgba(15, 23, 42, 0.08)"};
            }

            /* Pulsating Green Diode */
            @keyframes diodeGlow {
              0%, 100% {
                opacity: 1;
                box-shadow: 0 0 8px rgba(0, 245, 155, 0.8), 0 0 16px rgba(0, 245, 155, 0.3);
                transform: scale(1);
              }
              50% {
                opacity: 0.55;
                box-shadow: 0 0 3px rgba(0, 245, 155, 0.4);
                transform: scale(0.92);
              }
            }
            .diode-pulse {
              animation: diodeGlow 2s ease-in-out infinite;
            }

            /* XP Shimmer Micro-Animation */
            @keyframes xpShimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .xp-shimmer {
              background: linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.4) 50%, rgba(245, 158, 11, 0.15) 100%);
              background-size: 200% 100%;
              animation: xpShimmer 3s infinite linear;
            }
          `,
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 7,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",
                        border: "1px solid transparent",
                        transition: "all 0.12s ease-in-out",
                        "&:active": {
                            transform: "translateY(1px)",
                        },
                        "&:hover": {
                            boxShadow: "none",
                        },
                    },
                    containedPrimary: {
                        backgroundColor: isDark ? "#38BDF8" : "#0284C7",
                        color: isDark ? "#090B0E" : "#FFFFFF",
                        border: isDark ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid rgba(2, 132, 199, 0.3)",
                        "&:hover": {
                            backgroundColor: isDark ? "#0EA5E9" : "#0369A1",
                        },
                    },
                    containedSecondary: {
                        backgroundColor: isDark ? "#00F59B" : "#059669",
                        color: isDark ? "#090B0E" : "#FFFFFF",
                        boxShadow: isDark ? "0 0 14px rgba(0, 245, 155, 0.35)" : "0 2px 8px rgba(5, 150, 105, 0.25)",
                        "&:hover": {
                            backgroundColor: isDark ? "#00DC8B" : "#047857",
                            boxShadow: isDark ? "0 0 20px rgba(0, 245, 155, 0.5)" : "0 4px 12px rgba(5, 150, 105, 0.35)",
                        },
                    },
                    outlined: {
                        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.12)",
                        color: isDark ? "#EDEDED" : "#0F172A",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.02)",
                        "&:hover": {
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.06)",
                            borderColor: isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(15, 23, 42, 0.22)",
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        backgroundColor: isDark ? "#0F1319" : "#FFFFFF",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(15, 23, 42, 0.08)",
                        boxShadow: isDark ? "none" : "0 1px 3px rgba(15, 23, 42, 0.04)",
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        fontWeight: 600,
                        borderRadius: 5,
                        fontSize: "0.75rem",
                        fontVariantNumeric: "tabular-nums",
                    },
                },
            },
        },
    };
};

export const designTokens = {
    bg: "var(--ml-bg, #090B0E)",
    panel: "var(--ml-panel, #0F1319)",
    panelAlt: "var(--ml-panel-alt, #161C24)",
    panelGrad: "var(--ml-panel-grad, linear-gradient(180deg, #121821, #0C1015))",
    line: "var(--ml-line, rgba(255, 255, 255, 0.08))",
    lineSubtle: "var(--ml-line-subtle, rgba(255, 255, 255, 0.04))",
    text: "var(--ml-text, #EDEDED)",
    mute: "var(--ml-mute, #8A94A6)",
    dim: "var(--ml-dim, #5E6674)",
    faint: "var(--ml-faint, #2B323D)",
    acc: "var(--ml-acc, #34D399)",
    accContrast: "var(--ml-acc-contrast, #090B0E)",
    accGlow: "var(--ml-acc-glow, rgba(52, 211, 153, 0.55))",
    accWash: "var(--ml-acc-wash, linear-gradient(90deg, rgba(52, 211, 153, 0.06), transparent 70%))",
    grayGrad: "var(--ml-gray-grad, linear-gradient(180deg, #C9D1DC, #7C8696))",
    heroHeadlineL3: "var(--ml-hero-headline-l3, linear-gradient(180deg, #C9D1DC, #7C8696))",
    navBg: "var(--ml-nav-bg, rgba(9, 11, 14, 0.85))",
    cardBg: "var(--ml-card-bg, #0F1319)",
    codeBg: "var(--ml-code-bg, #0B0E14)",
    trackBg: "var(--ml-track-bg, #151A22)",
    scrollbarThumb: "var(--ml-scrollbar-thumb, rgba(255, 255, 255, 0.14))",
    cyan: "var(--ml-cyan, #67D9FF)",
    cyanBg: "var(--ml-cyan-bg, rgba(103, 217, 255, 0.08))",
    cyanBorder: "var(--ml-cyan-border, rgba(103, 217, 255, 0.28))",
    boxSubtleBg: "var(--ml-box-subtle-bg, rgba(255, 255, 255, 0.03))",
    boxSubtleBorder: "var(--ml-box-subtle-border, rgba(255, 255, 255, 0.08))",
    cardShadow: "var(--ml-card-shadow, 0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 20px 40px -20px rgba(0, 0, 0, 0.5))",
    vizContainerBg: "var(--ml-viz-container-bg, #11151A)",
    fontSans: "var(--font-inter), Inter, system-ui, -apple-system, sans-serif",
    fontMono: "var(--font-mono), 'JetBrains Mono', ui-monospace, Menlo, monospace",
    fontSerif: "var(--font-serif), 'Instrument Serif', Georgia, serif",
};

export const getTheme = (mode: "dark" | "light" = "dark"): Theme => {
    return createTheme(getThemeOptions(mode));
};

const defaultTheme = getTheme("dark");

export default defaultTheme;
