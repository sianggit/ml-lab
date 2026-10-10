import { redirect, notFound } from "next/navigation";
import { getChapterBySlug, ML_CHAPTERS } from "@/consts/ml-chapters.const";

interface BabRedirectProps {
    params: Promise<{
        chapterId: string;
    }>;
}

export function generateStaticParams() {
    return [
        ...ML_CHAPTERS.map((ch) => ({ chapterId: String(ch.number) })),
        ...ML_CHAPTERS.map((ch) => ({ chapterId: ch.number < 10 ? `0${ch.number}` : String(ch.number) })),
        ...ML_CHAPTERS.map((ch) => ({ chapterId: ch.slug })),
    ];
}

export default async function BabRedirectPage({ params }: BabRedirectProps) {
    const { chapterId } = await params;
    const chapter = getChapterBySlug(chapterId);

    if (!chapter) {
        notFound();
    }

    redirect(`/ml-lab/${chapter.slug}`);
}
