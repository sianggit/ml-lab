"use client";

import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/config/theme";
import { useEffect, useState } from "react";
import createCache from "@emotion/cache";
import getClientEmotionCache from "@/lib/emotion-cache-client";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [emotionCache, setEmotionCache] = useState<EmotionCache | null>(null);
    const nonce =
        typeof document !== "undefined"
            ? document.querySelector('meta[name="csp-nonce"]')?.getAttribute("content") || ""
            : "";
    const cache = createCache({ key: "css", nonce });

    useEffect(() => {
        const cache = getClientEmotionCache();
        setEmotionCache(cache);
    }, []);

    if (!emotionCache) return null;
    return (
        <CacheProvider value={cache}>
            <CacheProvider value={emotionCache}>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </CacheProvider>
        </CacheProvider>
    );
}
