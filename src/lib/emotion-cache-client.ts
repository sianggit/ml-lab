import createCache from "@emotion/cache";

let emotionCache: ReturnType<typeof createCache> | null = null;

export default function getClientEmotionCache(): ReturnType<typeof createCache> {
    if (emotionCache) return emotionCache;

    const nonce =
        typeof document !== "undefined"
            ? document.querySelector('meta[name="csp-nonce"]')?.getAttribute("content") || ""
            : "";

    emotionCache = createCache({
        key: "mui",
        prepend: true,
        nonce,
    });

    return emotionCache;
}
