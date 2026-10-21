import defineStyles from "@/utils/define-styles";
import { designTokens } from "@/config/theme";

export const customDatasetStudioStyles = defineStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
    },
    panelCard: {
        backgroundColor: designTokens.panel,
        border: `1px solid ${designTokens.line}`,
        borderRadius: "10px",
        p: { xs: "16px", md: "24px" },
        boxShadow: "var(--ml-card-shadow)",
        backdropFilter: "blur(12px)",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: "16px",
        pb: "12px",
        borderBottom: `1px solid ${designTokens.line}`,
    },
    cardTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "1.05rem",
        fontWeight: 650,
        color: designTokens.text,
        letterSpacing: "-0.01em",
    },
    dropzone: (isDragActive: boolean) => ({
        border: `2px dashed ${isDragActive ? designTokens.acc : designTokens.line}`,
        borderRadius: "10px",
        p: { xs: "28px 16px", md: "40px 24px" },
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragActive ? "rgba(52, 211, 153, 0.08)" : designTokens.panelAlt,
        transition: "all 0.2s ease",
        "&:hover": {
            borderColor: designTokens.acc,
            backgroundColor: "rgba(52, 211, 153, 0.05)",
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
        backgroundColor: "rgba(52, 211, 153, 0.12)",
        color: designTokens.acc,
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        gap: "12px",
        mb: "20px",
    },
    statItem: {
        backgroundColor: designTokens.panelAlt,
        border: `1px solid ${designTokens.line}`,
        borderRadius: "8px",
        p: "12px 16px",
    },
    statVal: {
        fontSize: "1.35rem",
        fontWeight: 700,
        color: designTokens.acc,
        fontFamily: designTokens.fontMono,
        lineHeight: 1.2,
    },
    statLabel: {
        fontSize: "0.75rem",
        color: designTokens.mute,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        mt: "4px",
    },
    tableContainer: {
        width: "100%",
        overflowX: "auto",
        border: `1px solid ${designTokens.line}`,
        borderRadius: "8px",
        backgroundColor: designTokens.panel,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.82rem",
        textAlign: "left",
        fontFamily: designTokens.fontMono,
        "& th": {
            p: "10px 14px",
            backgroundColor: designTokens.panelAlt,
            borderBottom: `1px solid ${designTokens.line}`,
            color: designTokens.dim,
            fontWeight: 600,
            whiteSpace: "nowrap",
        },
        "& td": {
            p: "8px 14px",
            borderBottom: `1px solid ${designTokens.line}`,
            color: designTokens.text,
            whiteSpace: "nowrap",
        },
        "& tr:hover td": {
            backgroundColor: designTokens.boxSubtleBg,
        },
    },
    chipBadge: (type: string) => {
        let bg = "rgba(148, 163, 184, 0.15)";
        let color = "#64748b";
        if (type === "numeric") {
            bg = "rgba(14, 165, 233, 0.12)";
            color = "#0284c7";
        } else if (type === "categorical") {
            bg = "rgba(168, 85, 247, 0.12)";
            color = "#9333ea";
        } else if (type === "boolean") {
            bg = "rgba(34, 197, 94, 0.12)";
            color = "#16a34a";
        } else if (type === "datetime") {
            bg = "rgba(245, 158, 11, 0.12)";
            color = "#d97706";
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
            fontFamily: designTokens.fontMono,
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
        color: "#b45309",
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
        color: "#b91c1c",
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
        backgroundColor: designTokens.text,
        color: designTokens.bg,
        border: `1px solid ${designTokens.text}`,
        "&:hover": {
            filter: "brightness(0.92)",
        },
    },
    btnSecondary: {
        backgroundColor: designTokens.panelAlt,
        color: designTokens.text,
        border: `1px solid ${designTokens.line}`,
        "&:hover": {
            backgroundColor: designTokens.panel,
            borderColor: designTokens.dim,
        },
    },
    btnDanger: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#dc2626",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        "&:hover": {
            backgroundColor: "rgba(239, 68, 68, 0.2)",
        },
    },
});
