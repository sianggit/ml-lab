"use client";

import { Suspense } from "react";
import Box from "@mui/material/Box";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/shared/components/navbar";
import Footer from "@/shared/components/footer";
import PageFallback from "@/shared/layout/page-fallback";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MainLayoutProps = {
    menuCode: MenuCodeEnum;
    actionCode: ActionCodeEnum;
    children?: React.ReactNode;
};

// ─── Page transition variants ─────────────────────────────────────────────────

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 12,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: "easeOut" as const,
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: 0.2,
            ease: "easeIn" as const,
        },
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MainLayout({ menuCode, actionCode, children }: MainLayoutProps) {
    const pathname = usePathname();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar activeMenu={menuCode} />

            <Box component="main" sx={{ flex: 1 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Suspense fallback={<PageFallback />}>
                            {children}
                        </Suspense>
                    </motion.div>
                </AnimatePresence>
            </Box>

            <Footer />
        </Box>
    );
}