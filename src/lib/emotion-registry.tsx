"use client";

import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { useState } from "react";

/**
 * EmotionRegistry — must wrap ThemeProvider in client-layout.
 *
 * Why this exists:
 * Next.js App Router SSRs Client Components on the server first, then
 * hydrates on the client. Emotion generates style tags dynamically, so
 * without this registry the server HTML has no <style> tags but the client
 * tries to inject them → text node mismatch → hydration error.
 *
 * This component:
 * 1. Creates the Emotion cache once (stable ref via useState init fn)
 * 2. Collects all styles inserted during SSR via useServerInsertedHTML
 * 3. Flushes them into <head> before hydration → server & client match
 */
export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
    const [registry] = useState(() => {
        const cache = createCache({ key: "mui", prepend: true });
        cache.compat = true; // required: prevents double insertion on hydration

        const prevInsert = cache.insert.bind(cache);
        let inserted: { name: string; isGlobal: boolean }[] = [];

        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push({ name: serialized.name, isGlobal: !args[0] });
            }
            return prevInsert(...args);
        };

        const flush = () => {
            const prev = inserted;
            inserted = [];
            return prev;
        };

        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const inserted = registry.flush();
        if (inserted.length === 0) return null;

        let styles = "";
        let dataEmotion = registry.cache.key;

        const globals: { name: string; style: string }[] = [];

        for (const { name, isGlobal } of inserted) {
            const style = registry.cache.inserted[name];
            if (typeof style === "string") {
                if (isGlobal) {
                    globals.push({ name, style });
                } else {
                    styles += style;
                    dataEmotion += ` ${name}`;
                }
            }
        }

        return (
            <>
                {globals.map(({ name, style }) => (
                    <style
                        key={name}
                        data-emotion={`${registry.cache.key}-global ${name}`}
                        dangerouslySetInnerHTML={{ __html: style }}
                    />
                ))}
                {styles && (
                    <style
                        data-emotion={dataEmotion}
                        dangerouslySetInnerHTML={{ __html: styles }}
                    />
                )}
            </>
        );
    });

    return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}