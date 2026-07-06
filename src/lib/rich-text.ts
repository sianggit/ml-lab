import he from "he";

/** For plain-text fields (titles, labels) that may contain HTML entities/tags from the CMS. */
export const cleanRichText = (str: string): string =>
    he.decode(str || "").replace(/<[^>]*>/g, "").trim();

/** For fields meant to be rendered as rich text via dangerouslySetInnerHTML. */
export const decodeRichHtml = (str?: string): string => he.decode(str ?? "").trim();
