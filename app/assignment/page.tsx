import type { Metadata } from "next";
import { lazy } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import type { MainLayoutProps } from "@/shared/layout/main-layout";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";

const MainLayout = lazy(() => import("@/shared/layout/main-layout"));
const AssignmentComponent = lazy(
    () => import("@/components/features/assignment-showcase")
);

export const metadata: Metadata = buildPageMetadata({
    title: "Assignment Showcase & Portofolio Tugas",
    description:
        "Portofolio akademik dan dokumentasi tugas mata kuliah Machine Learning oleh Anggit Arisa Siwi Pratama (NPM 202343570045, Kelas XC Ekstensi).",
    canonical: "/assignment",
});

const layoutProps: MainLayoutProps = {
    menuCode: MenuCodeEnum.assignment,
    actionCode: ActionCodeEnum.view,
};

export default function AssignmentPage() {
    return (
        <MainLayout {...layoutProps}>
            <AssignmentComponent />
        </MainLayout>
    );
}
