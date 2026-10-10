import type { Metadata } from "next";
import { lazy } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import type { MainLayoutProps } from "@/shared/layout/main-layout";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";

const MainLayout = lazy(() => import("@/shared/layout/main-layout"));
const ReportComponent = lazy(
    () => import("@/components/features/ml-lab/report-page")
);

export const metadata: Metadata = buildPageMetadata({
    title: "Laporan Evaluasi Praktikum | ML Lab",
    description:
        "Rekapitulasi capaian pembelajaran, status modul, dan ekspor portofolio praktikum Machine Learning Bab 01 - 14.",
    canonical: "/laporan",
});

const layoutProps: MainLayoutProps = {
    menuCode: MenuCodeEnum.laporan,
    actionCode: ActionCodeEnum.view,
};

export default function LaporanPage() {
    return (
        <MainLayout {...layoutProps}>
            <ReportComponent />
        </MainLayout>
    );
}
