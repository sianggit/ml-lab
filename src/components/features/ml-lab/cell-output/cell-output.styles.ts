import defineStyles from "@/utils/define-styles";

export const cellOutputStyles = defineStyles({
    container: {
        borderRadius: "8px",
        backgroundColor: "#0F1319",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        mt: 2,
    },
    headerBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.8,
        py: 0.8,
        backgroundColor: "#090B0E",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        flexWrap: "wrap",
        gap: 1,
    },
    tabGroup: {
        display: "flex",
        alignItems: "center",
        gap: 0.5,
    },
    tabItem: (isActive: boolean) => ({
        fontSize: "0.72rem",
        fontWeight: 600,
        fontFamily: "var(--font-mono), monospace",
        px: 1.2,
        py: 0.45,
        borderRadius: "4px",
        cursor: "pointer",
        color: isActive ? "#EDEDED" : "#8A94A6",
        backgroundColor: isActive ? "#0F1319" : "transparent",
        border: isActive ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid transparent",
        boxShadow: isActive ? "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)" : "none",
        letterSpacing: "0.03em",
        display: "flex",
        alignItems: "center",
        gap: 0.6,
        transition: "all 0.12s ease",
        "&:hover": {
            color: "#EDEDED",
            backgroundColor: isActive ? "#0F1319" : "rgba(255, 255, 255, 0.03)",
        },
    }),
    metaGroup: {
        display: "flex",
        alignItems: "center",
        gap: 1,
    },
    metaBadge: {
        fontSize: "0.7rem",
        color: "#8A94A6",
        fontFamily: "var(--font-mono), monospace",
        display: { xs: "none", sm: "inline-block" },
    },
    statusChip: (status: "idle" | "running" | "success" | "error") => ({
        fontSize: "0.7rem",
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
        height: 22,
        borderRadius: "4px",
        backgroundColor:
            status === "success"
                ? "rgba(0, 245, 155, 0.1)"
                : status === "error"
                ? "rgba(244, 63, 94, 0.12)"
                : status === "running"
                ? "rgba(245, 158, 11, 0.12)"
                : "rgba(255, 255, 255, 0.04)",
        color:
            status === "success"
                ? "#00F59B"
                : status === "error"
                ? "#F43F5E"
                : status === "running"
                ? "#F59E0B"
                : "#8A94A6",
        border:
            status === "success"
                ? "1px solid rgba(0, 245, 155, 0.3)"
                : status === "error"
                ? "1px solid rgba(244, 63, 94, 0.35)"
                : status === "running"
                ? "1px solid rgba(245, 158, 11, 0.35)"
                : "1px solid rgba(255, 255, 255, 0.06)",
    }),
    terminalBody: {
        p: 2,
        minHeight: "130px",
        maxHeight: "420px",
        overflowY: "auto",
        fontFamily: "var(--font-mono), 'JetBrains Mono', Consolas, monospace",
        fontSize: "0.825rem",
        lineHeight: 1.6,
        backgroundColor: "#090B0E",
    },
    stdoutText: {
        color: "#00F59B",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        margin: 0,
        fontFamily: "inherit",
    },
    placeholderText: {
        color: "#4B5563",
        fontFamily: "inherit",
        margin: 0,
    },

    // ─── Structured Diagnostic Traceback Card ────────────────────────────────
    diagnosticCard: {
        mt: 1.5,
        p: 2,
        borderRadius: "6px",
        backgroundColor: "#160C10",
        border: "1px solid rgba(244, 63, 94, 0.35)",
        boxShadow: "0 4px 16px rgba(244, 63, 94, 0.15)",
    },
    diagnosticHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1.2,
        pb: 1,
        borderBottom: "1px solid rgba(244, 63, 94, 0.2)",
    },
    diagnosticTitle: {
        fontSize: "0.78rem",
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
        color: "#F43F5E",
        display: "flex",
        alignItems: "center",
        gap: 0.8,
    },
    diagnosticLineBadge: {
        fontSize: "0.7rem",
        fontFamily: "var(--font-mono), monospace",
        color: "#EDEDED",
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        px: 0.8,
        py: 0.2,
        borderRadius: "3px",
        border: "1px solid rgba(244, 63, 94, 0.4)",
    },
    diagnosticCodeSnippet: {
        p: 1.2,
        borderRadius: "4px",
        backgroundColor: "#090B0E",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        color: "#EDEDED",
        fontSize: "0.8rem",
        fontFamily: "var(--font-mono), monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        mb: 1.5,
    },
    diagnosticSuggestionBox: {
        p: 1.2,
        borderRadius: "4px",
        backgroundColor: "rgba(56, 189, 248, 0.08)",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 0.4,
    },
    diagnosticSuggestionTitle: {
        fontSize: "0.72rem",
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
        color: "#38BDF8",
        letterSpacing: "0.04em",
    },
    diagnosticSuggestionText: {
        fontSize: "0.78rem",
        color: "#EDEDED",
        lineHeight: 1.5,
    },

    // ─── Interactive Plot Visualizer ─────────────────────────────────────────
    plotsSection: {
        p: 2,
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        backgroundColor: "#0F1319",
    },
    plotToolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1.5,
        flexWrap: "wrap",
        gap: 1,
    },
    plotTitle: {
        fontSize: "0.75rem",
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
        color: "#8A94A6",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
    },
    plotControlActions: {
        display: "flex",
        alignItems: "center",
        gap: 0.8,
    },
    plotActionBtn: {
        px: 1,
        py: 0.35,
        borderRadius: "4px",
        fontSize: "0.72rem",
        fontFamily: "var(--font-mono), monospace",
        fontWeight: 600,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#EDEDED",
        cursor: "pointer",
        textTransform: "none",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.2)",
        },
        "&:active": {
            transform: "translateY(1px)",
        },
    },
    plotImageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#090B0E",
        backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        borderRadius: "6px",
        p: 2,
        border: "1px solid rgba(255, 255, 255, 0.06)",
        overflow: "auto",
        maxHeight: "560px",
    },
    plotImageElement: (zoomScale: number) => ({
        maxWidth: "100%",
        height: "auto",
        borderRadius: "4px",
        transform: `scale(${zoomScale})`,
        transformOrigin: "center center",
        transition: "transform 0.2s ease-in-out",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.6)",
    }),
});

