"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ML_CHAPTERS } from "@/consts/ml-chapters.const";
import { pyodideBridge } from "@/services/ml-lab/pyodide-bridge.service";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import IconComponent from "@/shared/components/icon";
import { commandPaletteStyles } from "./command-palette.styles";

interface CommandItem {
    id: string;
    title: string;
    category: "Navigasi Bab" | "Aksi Sistem" | "Alat Praktikum";
    badge: string;
    badgeColor: string; // e.g. "124, 92, 252"
    action: () => void;
}

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { resetProgress } = useMlLabStore();

    // Global Cmd+K / Ctrl+K keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        const handleCustomOpen = () => setIsOpen(true);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-command-palette", handleCustomOpen);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-command-palette", handleCustomOpen);
        };
    }, []);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Build items list
    const systemActions: CommandItem[] = [
        {
            id: "act-sandbox",
            title: "Buka Python Sandbox (Monaco Playground)",
            category: "Alat Praktikum",
            badge: "PLAYGROUND",
            badgeColor: "0, 245, 155",
            action: () => {
                setIsOpen(false);
                router.push("/playground");
            },
        },
        {
            id: "act-report",
            title: "Ekspor & Resume Laporan Praktikum (PDF / Markdown)",
            category: "Alat Praktikum",
            badge: "REPORT",
            badgeColor: "255, 178, 36",
            action: () => {
                setIsOpen(false);
                router.push("/report");
            },
        },
        {
            id: "act-reset-kernel",
            title: "Reset Kernel Pyodide WebAssembly (Wipe Memory)",
            category: "Aksi Sistem",
            badge: "RESET WASM",
            badgeColor: "255, 77, 109",
            action: () => {
                pyodideBridge.resetKernel();
                setIsOpen(false);
            },
        },
        {
            id: "act-reset-progress",
            title: "Reset Seluruh Riwayat Praktikum & Progres Mahasiswa",
            category: "Aksi Sistem",
            badge: "RESET DATA",
            badgeColor: "255, 77, 109",
            action: () => {
                if (confirm("Apakah Anda yakin ingin mereset progres praktikum?")) {
                    resetProgress();
                    setIsOpen(false);
                }
            },
        },
    ];

    const chapterItems: CommandItem[] = ML_CHAPTERS.map((ch) => ({
        id: `ch-${ch.number}`,
        title: `Bab ${ch.number < 10 ? `0${ch.number}` : ch.number}: ${ch.title}`,
        category: "Navigasi Bab",
        badge: ch.category.toUpperCase(),
        badgeColor: "124, 92, 252",
        action: () => {
            setIsOpen(false);
            router.push(`/ml-lab/${ch.slug}`);
        },
    }));

    const allItems = [...systemActions, ...chapterItems];

    const filteredItems = allItems.filter((item) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.badge.toLowerCase().includes(q)
        );
    });

    const handleKeyDownInList = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev <= 0 ? filteredItems.length - 1 : prev - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredItems[selectedIndex]) {
                filteredItems[selectedIndex].action();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <Box sx={commandPaletteStyles.backdrop} onClick={() => setIsOpen(false)}>
            <Box
                sx={commandPaletteStyles.modal}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDownInList}
            >
                {/* Search Bar */}
                <Box sx={commandPaletteStyles.searchRow}>
                    <span style={commandPaletteStyles.searchIcon}>
                        <IconComponent name="search" size={16} />
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Cari bab, algoritma, atau jalankan perintah... (↑↓ navigasi, ↵ pilih)"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        style={commandPaletteStyles.searchInput as React.CSSProperties}
                    />
                    <Box sx={commandPaletteStyles.escBadge} onClick={() => setIsOpen(false)}>
                        ESC
                    </Box>
                </Box>

                {/* Results List */}
                <Box sx={commandPaletteStyles.resultsContainer}>
                    {filteredItems.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: "center", color: "#6B7280" }}>
                            Tidak ada bab atau perintah yang cocok dengan &quot;{query}&quot;
                        </Box>
                    ) : (
                        filteredItems.map((item, idx) => {
                            const isSelected = idx === selectedIndex;
                            return (
                                <Box
                                    key={item.id}
                                    sx={commandPaletteStyles.itemButton(isSelected)}
                                    onClick={item.action}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <Box sx={commandPaletteStyles.itemLeft}>
                                        <Box sx={commandPaletteStyles.itemBadge(item.badgeColor)}>
                                            {item.badge}
                                        </Box>
                                        <Typography sx={commandPaletteStyles.itemTitle}>
                                            {item.title}
                                        </Typography>
                                    </Box>
                                    <span style={{ fontSize: "0.8rem", color: isSelected ? "#A5B4FC" : "#4B5563" }}>
                                        ↵
                                    </span>
                                </Box>
                            );
                        })
                    )}
                </Box>

                {/* Footer Bar */}
                <Box sx={commandPaletteStyles.footerBar}>
                    <Box sx={commandPaletteStyles.footerKeyGroup}>
                        <span>
                            <span style={commandPaletteStyles.keyBadge}>↑</span>
                            <span style={commandPaletteStyles.keyBadge}>↓</span>
                            navigasi
                        </span>
                        <span>
                            <span style={commandPaletteStyles.keyBadge}>↵</span>
                            eksekusi
                        </span>
                        <span>
                            <span style={commandPaletteStyles.keyBadge}>ESC</span>
                            tutup
                        </span>
                    </Box>
                    <Box sx={{ color: "#7C5CFC", fontWeight: 600 }}>
                        AP ML Station • 2026 Engine
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
