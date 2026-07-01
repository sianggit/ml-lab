import type { Metadata } from "next";
import { lazy } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import type { MainLayoutProps } from "@/shared/layout/main-layout";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";

const MainLayout = lazy(() => import("@/shared/layout/main-layout"));
const MainComponent = lazy(() => import("@/components/home"));

export const metadata: Metadata = buildPageMetadata({
    title: "Page Title",
    description: "Page Description.",
    canonical: "/",
    ogImage: "/og/home.jpg",
});

const props: MainLayoutProps = {
    menuCode: MenuCodeEnum.home,
    actionCode: ActionCodeEnum.view,
};

export default function HomePage() {
    return (
        <MainLayout {...props}>
            <MainComponent />
        </MainLayout>
    );
}