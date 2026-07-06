"use client";

import MenuCodeEnum from "@/consts/menu-code.const";

type NavbarProps = {
    activeMenu: MenuCodeEnum;
    blurNav?: boolean;
};

/**
 * Navbar stub — replace with your real Navbar UI.
 * `activeMenu` tells you which nav item to highlight for the current page.
 * `blurNav` (optional) signals a transparent-over-hero nav that should turn
 * solid on scroll, vs. an always-solid nav — see MainLayoutProps.
 */
export default function Navbar({ activeMenu, blurNav }: NavbarProps) {
    void activeMenu;
    void blurNav;
    return <nav />;
}
