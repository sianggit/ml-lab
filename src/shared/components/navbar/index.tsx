"use client";

import MenuCodeEnum from "@/consts/menu-code.const";

type NavbarProps = {
    activeMenu: MenuCodeEnum;
};

/**
 * Navbar stub — replace body with your real Navbar component.
 * `activeMenu` drives which nav item is highlighted.
 *
 * Example usage inside the component:
 *   const isActive = (code: MenuCodeEnum) => code === activeMenu;
 */
export default function Navbar({ activeMenu }: NavbarProps) {
    // TODO: implement full Navbar UI
    // Use `activeMenu` to set active/highlighted state on nav items
    void activeMenu;
    return <nav />;
}