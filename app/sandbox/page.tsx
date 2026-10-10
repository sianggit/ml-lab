import type { Metadata } from "next";
import { lazy } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import type { MainLayoutProps } from "@/shared/layout/main-layout";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";

const MainLayout = lazy(() => import("@/shared/layout/main-layout"));
const SandboxComponent = lazy(
    () => import("@/components/features/ml-lab/sandbox-page")
);

export const metadata: Metadata = buildPageMetadata({
    title: "Monaco Scientific Workbench Sandbox | ML Lab",
    description:
        "Eksperimen bebas komputasi Python interaktif client-side berbasis WebAssembly Pyodide, NumPy, dan scikit-learn.",
    canonical: "/sandbox",
});

const layoutProps: MainLayoutProps = {
    menuCode: MenuCodeEnum.sandbox,
    actionCode: ActionCodeEnum.view,
};

export default function SandboxPage() {
    return (
        <MainLayout {...layoutProps}>
            <SandboxComponent />
        </MainLayout>
    );
}
