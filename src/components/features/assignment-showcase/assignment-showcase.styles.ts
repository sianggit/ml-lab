import { SxProps, Theme } from "@mui/material";

export const assignmentStyles = {
    wrap: {
        maxWidth: "1240px",
        mx: "auto",
        px: { xs: "16px", sm: "24px", md: "32px" },
        pt: { xs: "88px", md: "108px" },
        pb: "80px",
    } as SxProps<Theme>,

    headerCard: {
        p: { xs: "20px", sm: "28px" },
        mb: "28px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, rgba(23, 29, 36, 0.85) 0%, rgba(17, 21, 26, 0.95) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
        position: "relative",
        overflow: "hidden",
    } as SxProps<Theme>,

    headerBadgeRow: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        mb: "14px",
    } as SxProps<Theme>,

    badgeVerified: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        px: "10px",
        py: "3px",
        borderRadius: "6px",
        bgcolor: "rgba(67, 217, 163, 0.12)",
        color: "#43D9A3",
        border: "1px solid rgba(67, 217, 163, 0.30)",
        fontSize: "0.74rem",
        fontWeight: 650,
        fontFamily: "var(--font-mono), monospace",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
    } as SxProps<Theme>,

    badgeSemester: {
        display: "inline-flex",
        alignItems: "center",
        px: "10px",
        py: "3px",
        borderRadius: "6px",
        bgcolor: "rgba(103, 217, 255, 0.10)",
        color: "#67D9FF",
        border: "1px solid rgba(103, 217, 255, 0.25)",
        fontSize: "0.74rem",
        fontWeight: 600,
        fontFamily: "var(--font-mono), monospace",
    } as SxProps<Theme>,

    headerTitle: {
        fontSize: { xs: "1.6rem", sm: "2.1rem" },
        fontWeight: 800,
        color: "#F5F7FA",
        lineHeight: 1.25,
        mb: "8px",
        letterSpacing: "-0.01em",
    } as SxProps<Theme>,

    headerSubtitle: {
        fontSize: { xs: "0.95rem", sm: "1.05rem" },
        color: "#A3ADB9",
        lineHeight: 1.5,
        mb: "20px",
    } as SxProps<Theme>,

    studentMetaGrid: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        gap: "12px",
        pt: "16px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    } as SxProps<Theme>,

    metaItem: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
    } as SxProps<Theme>,

    metaLabel: {
        fontSize: "0.74rem",
        color: "#7E8B9B",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    } as SxProps<Theme>,

    metaValue: {
        fontSize: "0.90rem",
        color: "#F5F7FA",
        fontWeight: 650,
        fontFamily: "var(--font-mono), monospace",
    } as SxProps<Theme>,

    /* ─── Tabs Navigation ────────────────────────────── */
    tabsRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        mb: "24px",
        overflowX: "auto",
        pb: "4px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    } as SxProps<Theme>,

    tabButton: (isActive: boolean) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "16px",
        py: "10px",
        borderRadius: "8px",
        fontSize: "0.88rem",
        fontWeight: 600,
        color: isActive ? "#F5F7FA" : "#8E99A8",
        bgcolor: isActive ? "#1A222B" : "transparent",
        border: isActive ? "1px solid rgba(103, 217, 255, 0.40)" : "1px solid transparent",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.18s ease",
        "&:hover": {
            color: "#F5F7FA",
            bgcolor: "rgba(255, 255, 255, 0.04)",
        },
    }),

    tabBadge: (type: "completed" | "active" | "neutral") => ({
        px: "6px",
        py: "1.5px",
        borderRadius: "4px",
        fontSize: "0.68rem",
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
        textTransform: "uppercase",
        bgcolor:
            type === "completed"
                ? "rgba(67, 217, 163, 0.15)"
                : type === "active"
                ? "rgba(255, 184, 77, 0.15)"
                : "rgba(255, 255, 255, 0.08)",
        color:
            type === "completed"
                ? "#43D9A3"
                : type === "active"
                ? "#FFB84D"
                : "#A3ADB9",
    }),

    /* ─── Assignment Content Cards ───────────────────── */
    cardSection: {
        p: { xs: "20px", sm: "28px" },
        mb: "24px",
        borderRadius: "12px",
        bgcolor: "#11151A",
        border: "1px solid rgba(255, 255, 255, 0.08)",
    } as SxProps<Theme>,

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "12px",
        mb: "18px",
        pb: "14px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    } as SxProps<Theme>,

    sectionTitle: {
        fontSize: { xs: "1.2rem", sm: "1.35rem" },
        fontWeight: 750,
        color: "#F5F7FA",
        lineHeight: 1.3,
        mb: "4px",
    } as SxProps<Theme>,

    sectionSubtitle: {
        fontSize: "0.88rem",
        color: "#8E99A8",
        lineHeight: 1.4,
    } as SxProps<Theme>,

    /* ─── Metric Cards Grid ──────────────────────────── */
    metricGrid: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        gap: "12px",
        mb: "20px",
    } as SxProps<Theme>,

    metricCard: (highlight?: boolean) => ({
        p: "14px",
        borderRadius: "8px",
        bgcolor: highlight ? "rgba(103, 217, 255, 0.04)" : "rgba(255, 255, 255, 0.02)",
        border: highlight ? "1px solid rgba(103, 217, 255, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    }),

    metricLabel: {
        fontSize: "0.76rem",
        color: "#8E99A8",
        fontWeight: 500,
    } as SxProps<Theme>,

    metricValueRow: {
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
    } as SxProps<Theme>,

    metricValue: {
        fontSize: "1.3rem",
        fontWeight: 800,
        color: "#F5F7FA",
        fontFamily: "var(--font-mono), monospace",
    } as SxProps<Theme>,

    metricDelta: {
        fontSize: "0.76rem",
        fontWeight: 700,
        color: "#43D9A3",
        fontFamily: "var(--font-mono), monospace",
        bgcolor: "rgba(67, 217, 163, 0.12)",
        px: "5px",
        py: "1px",
        borderRadius: "4px",
    } as SxProps<Theme>,

    metricBaseline: {
        fontSize: "0.72rem",
        color: "#7E8B9B",
        fontFamily: "var(--font-mono), monospace",
    } as SxProps<Theme>,

    /* ─── Charts & Visuals ───────────────────────────── */
    chartsRow: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: "16px",
        mb: "20px",
    } as SxProps<Theme>,

    chartCard: {
        p: "14px",
        borderRadius: "8px",
        bgcolor: "rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    } as SxProps<Theme>,

    chartImage: {
        width: "100%",
        maxHeight: "260px",
        objectFit: "contain",
        borderRadius: "6px",
        mb: "8px",
        border: "1px solid rgba(255, 255, 255, 0.06)",
    } as SxProps<Theme>,

    chartCaption: {
        fontSize: "0.78rem",
        color: "#8E99A8",
        textAlign: "center",
        fontStyle: "italic",
    } as SxProps<Theme>,

    /* ─── Code Snippet ───────────────────────────────── */
    codeContainer: {
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        bgcolor: "#07090C",
        mb: "20px",
    } as SxProps<Theme>,

    codeHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: "14px",
        py: "8px",
        bgcolor: "rgba(255, 255, 255, 0.03)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    } as SxProps<Theme>,

    codeTitle: {
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "#A3ADB9",
        fontFamily: "var(--font-mono), monospace",
    } as SxProps<Theme>,

    codePre: {
        margin: 0,
        padding: "16px",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "0.78rem",
        lineHeight: 1.45,
        color: "#E2E8F0",
        overflowX: "auto",
        maxHeight: "380px",
    } as SxProps<Theme>,

    /* ─── Action Button Links ────────────────────────── */
    actionRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        mt: "18px",
    } as SxProps<Theme>,

    downloadBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "16px",
        py: "9px",
        borderRadius: "7px",
        bgcolor: "#67D9FF",
        color: "#0B0F19",
        fontWeight: 700,
        fontSize: "0.84rem",
        textDecoration: "none",
        transition: "all 0.18s ease",
        "&:hover": {
            bgcolor: "#8EE3FF",
            transform: "translateY(-1px)",
        },
    } as SxProps<Theme>,

    secondaryBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "16px",
        py: "9px",
        borderRadius: "7px",
        bgcolor: "rgba(255, 255, 255, 0.05)",
        color: "#F5F7FA",
        fontWeight: 600,
        fontSize: "0.84rem",
        textDecoration: "none",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        transition: "all 0.18s ease",
        "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.25)",
        },
    } as SxProps<Theme>,

    /* ─── Question Cards (UTS) ───────────────────────── */
    questionCard: {
        p: "18px",
        mb: "16px",
        borderRadius: "10px",
        bgcolor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
    } as SxProps<Theme>,

    questionBadgeRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        mb: "8px",
    } as SxProps<Theme>,

    questionNumber: {
        px: "8px",
        py: "2px",
        borderRadius: "4px",
        bgcolor: "rgba(103, 217, 255, 0.15)",
        color: "#67D9FF",
        fontSize: "0.74rem",
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
    } as SxProps<Theme>,

    questionTopic: {
        fontSize: "0.78rem",
        color: "#8E99A8",
        fontWeight: 500,
    } as SxProps<Theme>,

    questionTitle: {
        fontSize: "1.05rem",
        fontWeight: 700,
        color: "#F5F7FA",
        mb: "8px",
    } as SxProps<Theme>,

    questionDesc: {
        fontSize: "0.86rem",
        color: "#A3ADB9",
        lineHeight: 1.45,
        mb: "12px",
    } as SxProps<Theme>,

    solutionBox: {
        p: "14px",
        borderRadius: "8px",
        bgcolor: "rgba(0, 0, 0, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
    } as SxProps<Theme>,

    solutionPointTitle: {
        fontSize: "0.84rem",
        fontWeight: 700,
        color: "#43D9A3",
        mb: "6px",
    } as SxProps<Theme>,

    solutionList: {
        m: 0,
        pl: "18px",
        fontSize: "0.82rem",
        color: "#CBD5E1",
        lineHeight: 1.5,
    },

    /* ─── Roadmap Table ──────────────────────────────── */
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.84rem",
    } as SxProps<Theme>,

    th: {
        textAlign: "left",
        p: "10px 12px",
        color: "#8E99A8",
        fontWeight: 650,
        borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
        fontSize: "0.76rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    } as SxProps<Theme>,

    td: (highlighted?: boolean) => ({
        p: "12px",
        color: "#F5F7FA",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        bgcolor: highlighted ? "rgba(103, 217, 255, 0.04)" : "transparent",
    }),
};
