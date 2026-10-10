import type { Metadata } from "next";
import { lazy } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import type { MainLayoutProps } from "@/shared/layout/main-layout";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";

const MainLayout = lazy(() => import("@/shared/layout/main-layout"));
const CurriculumComponent = lazy(
    () => import("@/components/features/ml-lab/curriculum-page")
);

export const metadata: Metadata = buildPageMetadata({
    title: "Kurikulum Laboratorium Machine Learning | ML Lab",
    description:
        "Kurikulum 14 bab praktikum machine learning interaktif dari fondasi numerik, supervised learning, unsupervised learning, hingga deep learning dan MLOps.",
    canonical: "/kurikulum",
});

const layoutProps: MainLayoutProps = {
    menuCode: MenuCodeEnum.kurikulum,
    actionCode: ActionCodeEnum.view,
};

export default function KurikulumPage() {
    return (
        <MainLayout {...layoutProps}>
            <CurriculumComponent />
        </MainLayout>
    );
}
