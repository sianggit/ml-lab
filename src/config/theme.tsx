// theme.tsx
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Fonts — make sure you import Pretendard & Cormorant Garamond in _app.tsx or index.html
const fontPrimary = `'Pretendard', system-ui, sans-serif`;
const fontHeading = `'Cormorant Garamond', serif`;

const themeOptions: ThemeOptions = {
    palette: {
        mode: "dark",
        background: {
            default: "#0f0f10",
            paper: "rgba(255, 255, 255, 0.06)", // glass effect background
        },
        text: {
            primary: "#ffffff",
            secondary: "rgba(255, 255, 255, 0.7)",
        },
        primary: {
            main: "#ffffff", // accent color
        },
        secondary: {
            main: red[500],
        },
    },
    typography: {
        fontFamily: fontPrimary,
        h1: {
            fontFamily: fontHeading,
            fontWeight: 400,
            fontSize: "clamp(2rem, 5vw, 3rem)",
        },
        h2: {
            fontFamily: fontHeading,
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
        },
        h3: {
            fontFamily: fontHeading,
            fontWeight: 400,
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
        },
        body1: {
            fontFamily: fontPrimary,
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            lineHeight: 1.6,
        },
        body2: {
            fontFamily: fontPrimary,
            fontSize: "0.875rem",
            lineHeight: 1.6,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        /* Reset & Full Height */
        html, body, #__next, body > div:first-child {
          padding: 0;
          margin: 0;
          height: 100%;
          scroll-behavior: smooth;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }

        /* Section Background with Gradient Overlay */
        .section-bg {
          position: relative;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }
        .section-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, .35), rgba(0, 0, 0, .55));
        }

        /* Glassmorphism */
        .glass {
          backdrop-filter: blur(10px);
          background: linear-gradient(180deg, rgba(255, 255, 255, .12), rgba(255, 255, 255, .06));
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, .22);
          box-shadow: 0 8px 30px rgba(0, 0, 0, .25);
        }
        @media (max-width: 768px) {
          .glass {
            padding: 1rem !important;
            border-radius: 12px;
          }
        }

        /* Animations */
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .fade-out {
          animation: fadeOut 0.6s ease-in forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.98);
            filter: blur(2px);
          }
        }

        /* Rotate Animation */
        .rotate {
          animation: rotate 4s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `,
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;
