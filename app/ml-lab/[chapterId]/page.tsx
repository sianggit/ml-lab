import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lazy } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import type { MainLayoutProps } from "@/shared/layout/main-layout";
import MenuCodeEnum from "@/consts/menu-code.const";
import ActionCodeEnum from "@/consts/action-code.const";
import { ML_CHAPTERS, getChapterBySlug } from "@/consts/ml-chapters.const";

const MainLayout = lazy(() => import("@/shared/layout/main-layout"));
const ChapterView = lazy(() => import("@/components/features/ml-lab/chapter-view"));

interface ChapterPageProps {
    params: Promise<{
        chapterId: string;
    }>;
}

export function generateStaticParams() {
    return [
        ...ML_CHAPTERS.map((ch) => ({
            chapterId: ch.slug,
        })),
        { chapterId: "bab-01-numpy" },
    ];
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
    const { chapterId } = await params;
    const chapter = getChapterBySlug(chapterId);

    if (!chapter) {
        return buildPageMetadata({
            title: "Bab Tidak Ditemukan",
            description: "Modul praktikum Machine Learning tidak ditemukan.",
            canonical: `/ml-lab/${chapterId}`,
        });
    }

    return buildPageMetadata({
        title: `Bab ${chapter.number}: ${chapter.title} | ML Lab`,
        description: chapter.summary,
        canonical: `/ml-lab/${chapter.slug}`,
    });
}

const layoutProps: MainLayoutProps = {
    menuCode: MenuCodeEnum.ml_lab,
    actionCode: ActionCodeEnum.view,
};

export default async function ChapterPage({ params }: ChapterPageProps) {
    const { chapterId } = await params;
    const chapter = getChapterBySlug(chapterId);

    if (!chapter) {
        notFound();
    }

    return (
        <MainLayout {...layoutProps}>
            <ChapterView chapter={chapter} />
        </MainLayout>
    );
}
