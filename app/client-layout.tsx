"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/config/theme";
import EmotionRegistry from "@/lib/emotion-registry";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <EmotionRegistry>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </EmotionRegistry>
    );
}