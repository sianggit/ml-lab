import defineStyles from "@/utils/define-styles";

export const customDatasetStudioStyles = defineStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
    },
    panelCard: {
        background: "rgba(17, 21, 26, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "10px",
        p: { xs: "16px", md: "24px" },
        backdropFilter: "blur(12px)",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: "16px",
        pb: "12px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    },
    cardTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "1.05rem",
        fontWeight: 650,
        color: "#F5F7FA",
        letterSpacing: "-0.01em",
    },
    dropzone: (isDragActive: boolean) => ({
        border: `2px dashed ${isDragActive ? "#38bdf8" : "rgba(255, 255, 255, 0.15)"}`,
        borderRadius: "10px",
        p: { xs: "28px 16px", md: "40px 24px" },
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragActive ? "rgba(56, 189, 248, 0.06)" : "rgba(255, 255, 255, 0.02)",
        transition: "all 0.2s ease",
        "&:hover": {
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56, 189, 248, 0.04)",
        },
    }),
    uploadIconWrap: {
        width: 52,
        height: 52,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
        backgroundColor: "rgba(56, 189, 248, 0.12)",
        color: "#38bdf8",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        gap: "12px",
        mb: "20px",
    },
    statItem: {
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "8px",
        p: "12px 16px",
    },
    statVal: {
        fontSize: "1.35rem",
        fontWeight: 700,
        color: "#38bdf8",
        fontFamily: "var(--font-mono), monospace",
        lineHeight: 1.2,
    },
    statLabel: {
        fontSize: "0.75rem",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        mt: "4px",
    },
    tableContainer: {
        width: "100%",
        overflowX: "auto",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "8px",
        backgroundColor: "rgba(10, 13, 18, 0.8)",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.82rem",
        textAlign: "left",
        fontFamily: "var(--font-mono), monospace",
        "& th": {
            p: "10px 14px",
            background: "rgba(255, 255, 255, 0.04)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#cbd5e1",
            fontWeight: 600,
            whiteSpace: "nowrap",
        },
        "& td": {
            p: "8px 14px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
            color: "#e2e8f0",
            whiteSpace: "nowrap",
        },
        "& tr:hover td": {
            backgroundColor: "rgba(255, 255, 255, 0.02)",
        },
    },
    chipBadge: (type: string) => {
        let bg = "rgba(148, 163, 184, 0.15)";
        let color = "#94a3b8";
        if (type === "numeric") {
            bg = "rgba(56, 189, 248, 0.15)";
            color = "#38bdf8";
        } else if (type === "categorical") {
            bg = "rgba(168, 85, 247, 0.15)";
            color = "#c084fc";
        } else if (type === "boolean") {
            bg = "rgba(34, 197, 94, 0.15)";
            color = "#4ade80";
        } else if (type === "datetime") {
            bg = "rgba(245, 158, 11, 0.15)";
            color = "#fbbf24";
        }
        return {
            display: "inline-block",
            fontSize: "0.7rem",
            px: "6px",
            py: "2px",
            borderRadius: "4px",
            backgroundColor: bg,
            color,
            fontWeight: 600,
            textTransform: "uppercase",
            fontFamily: "var(--font-mono), monospace",
        };
    },
    warningAlert: {
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        p: "12px 16px",
        borderRadius: "8px",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        border: "1px solid rgba(234, 179, 8, 0.25)",
        color: "#fde047",
        fontSize: "0.85rem",
        mb: "16px",
    },
    errorAlert: {
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        p: "12px 16px",
        borderRadius: "8px",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        color: "#fca5a5",
        fontSize: "0.85rem",
        mb: "16px",
    },
    actionBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "16px",
        py: "8px",
        borderRadius: "6px",
        fontSize: "0.85rem",
        fontWeight: 600,
        textTransform: "none",
        cursor: "pointer",
        transition: "all 0.15s ease",
    },
    btnPrimary: {
        backgroundColor: "#0284c7",
        color: "#ffffff",
        border: "1px solid #38bdf8",
        "&:hover": {
            backgroundColor: "#0369a1",
        },
    },
    btnSecondary: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "#e2e8f0",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
    },
    btnDanger: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#f87171",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        "&:hover": {
            backgroundColor: "rgba(239, 68, 68, 0.2)",
        },
    },
});
