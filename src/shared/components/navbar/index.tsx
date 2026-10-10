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
    label: string;
    href: string;
    code: MenuCodeEnum;
    match: (pathname: string, activeMenu: MenuCodeEnum) => boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: "Beranda",
        href: "/",
        code: MenuCodeEnum.home,
        match: (pathname, activeMenu) =>
            activeMenu === MenuCodeEnum.home || pathname === "/",
    },
    {
        label: "Kurikulum",
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
        label: "Sandbox",
        href: "/sandbox",
        code: MenuCodeEnum.sandbox,
        match: (pathname, activeMenu) =>
            activeMenu === MenuCodeEnum.sandbox ||
            activeMenu === MenuCodeEnum.playground ||
            pathname.startsWith("/sandbox") ||
            pathname.startsWith("/playground"),
    },
    {
        label: "Laporan",
        href: "/laporan",
        code: MenuCodeEnum.laporan,
        match: (pathname, activeMenu) =>
            activeMenu === MenuCodeEnum.laporan ||
            activeMenu === MenuCodeEnum.report ||
            pathname.startsWith("/laporan") ||
            pathname.startsWith("/report"),
    },
];

export default function Navbar({ activeMenu, blurNav = false }: NavbarProps) {
    const pathname = usePathname() || "/";
    const [scrolled, setScrolled] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const { totalXp } = useMlLabStore();

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
    const currentXp = isMounted ? totalXp : 425;
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
                        <svg viewBox="0 0 32 32" aria-hidden="true" style={navbarStyles.logoSvg}>
                            <rect
                                x=".75"
                                y=".75"
                                width="30.5"
                                height="30.5"
                                rx="8"
                                fill="#11151A"
                                stroke="rgba(255,255,255,.14)"
                            />
                            <path
                                d="M5 14c4 7 7 7 11 0s7-7 11 0"
                                fill="none"
                                stroke="#F5F7FA"
                                strokeOpacity=".3"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            />
                            <path
                                d="M5 21c4-9 7-9 11 0s7 9 11 0"
                                fill="none"
                                stroke="#67D9FF"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                            <circle cx="10.5" cy="14.3" r="2.2" fill="#43D9A3" />
                        </svg>
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
                    <Box component="nav" sx={navbarStyles.nav} aria-label="Navigasi utama">
                        {NAV_ITEMS.map((item) => {
                            const isActive = item.match(pathname, activeMenu);
                            return (
                                <Box
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    sx={navbarStyles.navLink(isActive)}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {item.label}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* ─── Right Wing: Gamification & Actions ────────────────── */}
                    <Box sx={navbarStyles.act} className="act">
                        {/* XP Pill */}
                        <Box
                            sx={navbarStyles.xp}
                            className="xp"
                            id="xp"
                            onClick={() => setProfileModalOpen(true)}
                            title={`Level ${userLevel} · ${currentXp} XP (Klik untuk profil mahasiswa)`}
                            role="button"
                            tabIndex={0}
                        >
                            <Box component="b" sx={navbarStyles.lv} className="lv" title="Level">
                                {userLevel}
                            </Box>
                            <Box component="span" sx={navbarStyles.xt} className="xt">
                                {currentXp}
                                <Box component="small" sx={navbarStyles.xtMuted}>
                                    {" "}/ 1400 XP
                                </Box>
                            </Box>
                            <Box component="i" sx={navbarStyles.xpBarTrack}>
                                <Box component="b" sx={navbarStyles.xpBarFill(xpPercent)} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Profile Dialog */}
            <StudentProfileModal
                open={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
            />
        </>
    );
}
