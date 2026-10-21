"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/config/theme";
import EmotionRegistry from "@/lib/emotion-registry";
import { useMlLabStore } from "@/stores/use-ml-lab-store";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { themeMode } = useMlLabStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        useMlLabStore.persist.rehydrate();
        setMounted(true);
    }, []);

    const activeMode = mounted ? themeMode : "dark";

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-theme", activeMode);
            document.documentElement.style.colorScheme = activeMode;
        }
    }, [activeMode]);

    const currentTheme = useMemo(() => getTheme(activeMode), [activeMode]);

    return (
        <EmotionRegistry>
            <ThemeProvider theme={currentTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </EmotionRegistry>
    );
}