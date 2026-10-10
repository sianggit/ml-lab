import defineStyles from "@/utils/define-styles";

export const footerStyles = defineStyles({
    footer: {
        mt: "auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.10)",
        backgroundColor: "#090B0E",
        color: "#727F8E",
        py: { xs: 4, md: 5 },
    },
    container: {
        maxWidth: "1240px",
        mx: "auto",
        px: { xs: 2, sm: 3 },
    },
    mainGrid: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
        gap: 4,
        mb: 4,
    },
    brandColumn: {
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
    },
    brandTitle: {
        fontWeight: 700,
        fontSize: "1.1rem",
        color: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        gap: 1,
    },
    brandSubtitle: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
        color: "#9CA3AF",
        maxWidth: 420,
    },
    columnTitle: {
        fontWeight: 600,
        fontSize: "0.875rem",
        color: "#F9FAFB",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        mb: 1.5,
    },
    linkList: {
        listStyle: "none",
        p: 0,
        m: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
    },
    footerLink: {
        color: "#9CA3AF",
        textDecoration: "none",
        fontSize: "0.85rem",
        transition: "color 0.2s ease",
        "&:hover": {
            color: "#A5B4FC",
        },
    },
    bottomBar: {
        pt: 3,
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
    },
    copyrightText: {
        fontSize: "0.8rem",
        color: "#6B7280",
    },
    badgeRow: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
    },
});
