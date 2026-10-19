"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import MenuCodeEnum from "@/consts/menu-code.const";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import StudentProfileModal from "@/components/features/ml-lab/student-profile-modal";
import { navbarStyles } from "./navbar.styles";

type NavbarProps = {
    activeMenu: MenuCodeEnum;
    blurNav?: boolean;
};

interface NavItem {
    num: string;
    label: string;
    href: string;
    code: MenuCodeEnum;
    tag?: string;
    match: (pathname: string, activeMenu: MenuCodeEnum) => boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        num: "01",
        label: "Beranda",
        href: "/",
        code: MenuCodeEnum.home,
        match: (pathname, activeMenu) =>
            activeMenu === MenuCodeEnum.home || pathname === "/",
    },
    {
        num: "02",
        label: "Assignment",
        tag: "Showcase",
        href: "/assignment",
        code: MenuCodeEnum.assignment,
        match: (pathname, activeMenu) =>
            activeMenu === MenuCodeEnum.assignment ||
            pathname.startsWith("/assignment"),
    },
    {
        num: "03",
        label: "Kurikulum",
        tag: "Arsip",
        href: "/kurikulum",
        code: MenuCodeEnum.kurikulum,
        match: (pathname, activeMenu) =>
            activeMenu === MenuCodeEnum.kurikulum ||
            activeMenu === MenuCodeEnum.ml_lab ||
            pathname.startsWith("/kurikulum") ||
            pathname.startsWith("/ml-lab") ||
            pathname.startsWith("/bab"),
    },
    {
        num: "04",
        label: "Sandbox",
        tag: "Simulator",
        href: "/sandbox",
        code: MenuCodeEnum.sandbox,
        match: (pathname, activeMenu) =>
            activeMenu === MenuCodeEnum.sandbox ||
            activeMenu === MenuCodeEnum.playground ||
            pathname.startsWith("/sandbox") ||
            pathname.startsWith("/playground"),
    },
];

export default function Navbar({ activeMenu, blurNav = false }: NavbarProps) {
    const pathname = usePathname() || "/";
    const [scrolled, setScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { totalXp, isProfileModalOpen, setProfileModalOpen, themeMode, toggleThemeMode } = useMlLabStore();

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // XP & Gamification level calculations: Target = 1400 XP
    const currentXp = isMounted ? totalXp : 350;
    const maxTargetXp = 1400;
    const userLevel = Math.max(1, Math.floor(currentXp / 350) + 1);
    const xpPercent = Math.min(100, Math.round((currentXp / maxTargetXp) * 100));

    return (
        <>
            <Box
                component="header"
                sx={navbarStyles.header(blurNav, scrolled)}
                className={`bar ${scrolled || !blurNav ? "sc" : ""}`}
            >
                <Box sx={navbarStyles.wrap} className="wrap">
                    {/* ─── Logo ──────────────────────────────────────────────── */}
                    <Box
                        component={Link}
                        href="/"
                        sx={navbarStyles.logo}
                        className="logo"
                        aria-label="ML Lab, beranda"
                    >
                        <Box
                            component="img"
                            src="/ap-logo-white.png"
                            alt="Logo Anggit Pratama"
                            sx={{
                                height: 32,
                                width: "auto",
                                maxWidth: 48,
                                objectFit: "contain",
                                display: "block",
                                filter:
                                    isMounted && themeMode === "light"
                                        ? "invert(0.9) drop-shadow(0 2px 8px rgba(2, 132, 199, 0.2))"
                                        : "drop-shadow(0 2px 8px rgba(103, 217, 255, 0.25))",
                                transition: "filter 0.25s ease",
                            }}
                        />
                        <Box sx={navbarStyles.logoTextWrapper}>
                            <Box component="b" sx={navbarStyles.logoTitle}>
                                ML Lab
                            </Box>
                            <Box component="small" sx={navbarStyles.logoSubtitle}>
                                by Anggit Pratama
                            </Box>
                        </Box>
                    </Box>

                    {/* ─── Center Navigation ──────────────────────────────────── */}
                    <Box component="nav" sx={navbarStyles.nav} className="tabs" aria-label="Navigasi utama">
                        {NAV_ITEMS.map((item) => {
                            const isActive = item.match(pathname, activeMenu);
                            return (
                                <Box
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    sx={navbarStyles.navLink(isActive)}
                                    className={isActive ? "on" : ""}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Box component="sup" sx={navbarStyles.navSup(isActive)}>
                                        {item.num}
                                    </Box>
                                    <span>{item.label}</span>
                                    {item.tag && (
                                        <Box component="small" sx={navbarStyles.navSmall}>
                                            {item.tag}
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* ─── Right Wing: Gamification & Actions ────────────────── */}
                    <Box sx={navbarStyles.act} className="act">
                        {/* Theme Mode Switcher */}
                        <Box
                            component="button"
                            type="button"
                            sx={navbarStyles.themeToggle}
                            onClick={toggleThemeMode}
                            title={isMounted && themeMode === "light" ? "Ganti ke Mode Gelap" : "Ganti ke Mode Terang"}
                            aria-label={isMounted && themeMode === "light" ? "Ganti ke Mode Gelap" : "Ganti ke Mode Terang"}
                        >
                            {isMounted && themeMode === "light" ? (
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            )}
                        </Box>

                        {/* Redesigned XP Widget */}
                        <Box
                            sx={navbarStyles.xp}
                            className="xp"
                            id="xp"
                            onClick={() => setProfileModalOpen(true)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setProfileModalOpen(true);
                                }
                            }}
                            title={`${currentXp} dari ${maxTargetXp} XP menuju level ${userLevel + 1}`}
                            role="button"
                            tabIndex={0}
                            aria-haspopup="dialog"
                            aria-label="Lihat detail identitas akademik dan progres XP"
                        >
                            <Box sx={navbarStyles.xpColLevel}>
                                <Box component="label" sx={navbarStyles.xpLabel}>Level</Box>
                                <Box component="i" sx={navbarStyles.xpLevelNum}>
                                    {String(userLevel).padStart(2, "0")}
                                </Box>
                            </Box>
                            <Box sx={navbarStyles.xpColDetails}>
                                <Box sx={navbarStyles.xpRow} className="row">
                                    <b>{currentXp}</b>
                                    <span>/ {maxTargetXp} XP</span>
                                </Box>
                                <Box component="div" sx={navbarStyles.xpTrack} className="track">
                                    <Box component="u" sx={navbarStyles.xpFill(xpPercent)} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Profile Dialog */}
            <StudentProfileModal
                open={isProfileModalOpen}
                onClose={() => setProfileModalOpen(false)}
            />
        </>
    );
}
