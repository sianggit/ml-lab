// theme.tsx
import { createTheme, ThemeOptions } from "@mui/material/styles";

// Fonts — configured with Next.js font variables fallback to system typography
const fontPrimary = `var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
const fontMono = `var(--font-mono), 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace`;

const themeOptions: ThemeOptions = {
    palette: {
        mode: "dark",
        primary: {
            main: "#38BDF8", // Clean Steel Blue
            light: "#7DD3FC",
            dark: "#0284C7",
            contrastText: "#090B0E",
        },
        secondary: {
            main: "#00F59B", // Emerald Glow / Laser Mint Execution Accent
            light: "#5CFFC1",
            dark: "#00C27A",
            contrastText: "#090B0E",
        },
        background: {
            default: "#090B0E", // Tactical Blueprint Canvas
            paper: "#0F1319", // Workspace Panels & Master Cards
        },
        text: {
            primary: "#EDEDED", // Solid Crisp Chalk White
            secondary: "#8A94A6", // High-Contrast Muted Secondary Slate
            disabled: "#4B5563",
        },
        divider: "rgba(255, 255, 255, 0.06)", // Crisp Micro-Border Hairline
        info: {
            main: "#38BDF8", // Clean Steel Blue
            light: "#7DD3FC",
            dark: "#0284C7",
        },
        warning: {
            main: "#F59E0B", // Refined Amber Bronze / XP HUD
            light: "#FBBF24",
            dark: "#D97706",
        },
        error: {
            main: "#F43F5E", // Precision Crimson
            light: "#FB7185",
            dark: "#E11D48",
        },
        success: {
            main: "#00F59B", // Emerald Glow
            light: "#5CFFC1",
            dark: "#00C27A",
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
            color: "#EDEDED",
        },
        h2: {
            fontFamily: fontPrimary,
            fontWeight: 700,
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            color: "#EDEDED",
        },
        h3: {
            fontFamily: fontPrimary,
            fontWeight: 700,
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            color: "#EDEDED",
        },
        h4: {
            fontFamily: fontPrimary,
            fontWeight: 600,
            fontSize: "1.25rem",
            letterSpacing: "-0.015em",
            lineHeight: 1.4,
            color: "#EDEDED",
        },
        h5: {
            fontFamily: fontPrimary,
            fontWeight: 600,
            fontSize: "1.1rem",
            lineHeight: 1.4,
            color: "#EDEDED",
        },
        h6: {
            fontFamily: fontPrimary,
            fontWeight: 600,
            fontSize: "0.95rem",
            lineHeight: 1.4,
            color: "#EDEDED",
        },
        subtitle1: {
            fontFamily: fontPrimary,
            fontSize: "1rem",
            lineHeight: 1.5,
            color: "#8A94A6",
        },
        subtitle2: {
            fontFamily: fontPrimary,
            fontSize: "0.875rem",
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#8A94A6",
        },
        body1: {
            fontFamily: fontPrimary,
            fontSize: "0.95rem",
            lineHeight: 1.65,
            color: "#EDEDED",
        },
        body2: {
            fontFamily: fontPrimary,
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "#8A94A6",
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
        /* Reset & Base HTML */
        html, body, #__next, body > div:first-child {
          padding: 0;
          margin: 0;
          min-height: 100%;
          background-color: #090B0E;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          color: #EDEDED;
          scroll-behavior: smooth;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }

        /* Monospace Code & Tabular Numbers */
        code, pre, kbd, samp {
          font-family: ${fontMono} !important;
          font-variant-numeric: tabular-nums;
        }

        /* Tactile Hairline Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #090B0E;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.22);
        }

        /* Surface Elevation Hierarchy */
        .workspace-shell {
          background: #090B0E;
        }
        .workspace-panel {
          background: #0F1319;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
        }
        .workspace-panel:hover {
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 24px -4px rgba(0, 0, 0, 0.6);
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
                    backgroundColor: "#38BDF8",
                    color: "#090B0E",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    "&:hover": {
                        backgroundColor: "#0EA5E9",
                    },
                },
                containedSecondary: {
                    backgroundColor: "#00F59B",
                    color: "#090B0E",
                    boxShadow: "0 0 14px rgba(0, 245, 155, 0.35)",
                    "&:hover": {
                        backgroundColor: "#00DC8B",
                        boxShadow: "0 0 20px rgba(0, 245, 155, 0.5)",
                    },
                },
                outlined: {
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    color: "#EDEDED",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        borderColor: "rgba(255, 255, 255, 0.16)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "#0F1319",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
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

const theme = createTheme(themeOptions);

export default theme;
