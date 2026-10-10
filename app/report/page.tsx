import type { Metadata } from "next";
import { lazy } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import type { MainLayoutProps } from "@/shared/layout/main-layout";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";

const MainLayout = lazy(() => import("@/shared/layout/main-layout"));
const ReportComponent = lazy(() => import("@/components/features/ml-lab/report-page"));

export const metadata: Metadata = buildPageMetadata({
    title: "Laporan Evaluasi & Rekapitulasi Praktikum | ML Lab",
    description: "Rekapitulasi capaian pembelajaran dan rumus kunci praktikum Machine Learning Bab 01 - 14.",
    canonical: "/report",
});

const layoutProps: MainLayoutProps = {
    menuCode: MenuCodeEnum.laporan,
    actionCode: ActionCodeEnum.view,
};

export default function ReportPage() {
    return (
        <MainLayout {...layoutProps}>
            <ReportComponent />
        </MainLayout>
    );
}
