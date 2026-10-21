"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import { designTokens } from "@/config/theme";

export interface ScrollableTabsRowProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
    scrollContainerSx?: SxProps<Theme>;
    role?: string;
    ariaLabel?: string;
    scrollStep?: number;
}

export default function ScrollableTabsRow({
    children,
    sx,
    scrollContainerSx,
    role = "tablist",
    ariaLabel,
    scrollStep = 240,
}: ScrollableTabsRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 4);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        checkScroll();

        el.addEventListener("scroll", checkScroll, { passive: true });

        const ro = new ResizeObserver(() => {
            checkScroll();
        });
        ro.observe(el);

        return () => {
            el.removeEventListener("scroll", checkScroll);
            ro.disconnect();
        };
    }, [checkScroll]);

    const handleScroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const delta = direction === "left" ? -scrollStep : scrollStep;
        el.scrollBy({ left: delta, behavior: "smooth" });
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                ...sx,
            }}
        >
            {/* Left Floating Chevron with Gradient Fade Mask */}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    background: "linear-gradient(90deg, var(--ml-bg, #090B0E) 40%, transparent 100%)",
                    zIndex: 4,
                    pointerEvents: canScrollLeft ? "auto" : "none",
                    opacity: canScrollLeft ? 1 : 0,
                    transition: "opacity 0.25s ease",
                }}
            >
                <Box
                    component="button"
                    type="button"
                    onClick={() => handleScroll("left")}
                    aria-label="Scroll tab ke kiri"
                    tabIndex={canScrollLeft ? 0 : -1}
                    sx={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        border: `1px solid ${designTokens.line}`,
                        backgroundColor: designTokens.panel,
                        boxShadow: "var(--ml-card-shadow)",
                        backdropFilter: "blur(8px)",
                        color: designTokens.text,
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.2, 0.7, 0.2, 1)",
                        "&:hover": {
                            borderColor: designTokens.acc,
                            color: designTokens.text,
                            boxShadow: `0 0 12px ${designTokens.accGlow}`,
                            transform: "scale(1.06)",
                        },
                        "&:focus-visible": {
                            outline: `1px solid ${designTokens.acc}`,
                            outlineOffset: "2px",
                        },
                    }}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </Box>
            </Box>

            {/* Scrollable Container with Redesigned Hairline Scrollbar */}
            <Box
                ref={scrollRef}
                role={role}
                aria-label={ariaLabel}
                sx={{
                    display: "flex",
                    alignItems: "baseline",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                    /* Hide scrollbar since it's indicated by floating chevrons */
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                        width: 0,
                        height: 0,
                    },
                    ...scrollContainerSx,
                }}
            >
                {children}
            </Box>

            {/* Right Floating Chevron with Gradient Fade Mask */}
            <Box
                sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    background: "linear-gradient(270deg, var(--ml-bg, #090B0E) 40%, transparent 100%)",
                    zIndex: 4,
                    pointerEvents: canScrollRight ? "auto" : "none",
                    opacity: canScrollRight ? 1 : 0,
                    transition: "opacity 0.25s ease",
                }}
            >
                <Box
                    component="button"
                    type="button"
                    onClick={() => handleScroll("right")}
                    aria-label="Scroll tab ke kanan"
                    tabIndex={canScrollRight ? 0 : -1}
                    sx={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        border: `1px solid ${designTokens.line}`,
                        backgroundColor: designTokens.panel,
                        boxShadow: "var(--ml-card-shadow)",
                        backdropFilter: "blur(8px)",
                        color: designTokens.text,
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.2, 0.7, 0.2, 1)",
                        "&:hover": {
                            borderColor: designTokens.acc,
                            color: designTokens.text,
                            boxShadow: `0 0 12px ${designTokens.accGlow}`,
                            transform: "scale(1.06)",
                        },
                        "&:focus-visible": {
                            outline: `1px solid ${designTokens.acc}`,
                            outlineOffset: "2px",
                        },
                    }}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </Box>
            </Box>
        </Box>
    );
}
