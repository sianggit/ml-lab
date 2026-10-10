import defineStyles from "@/utils/define-styles";

export const studentProfileModalStyles = defineStyles({
    container: {
        p: { xs: 2.5, sm: 3.5 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        backgroundColor: "#111827",
        color: "#F9FAFB",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        pb: 1.5,
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    },
    title: {
        fontSize: "1.15rem",
        fontWeight: 700,
        color: "#F9FAFB",
    },
    subtitle: {
        fontSize: "0.825rem",
        color: "#9CA3AF",
    },
    formField: {
        display: "flex",
        flexDirection: "column",
        gap: 0.8,
    },
    fieldLabel: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#E5E7EB",
    },
    input: {
        backgroundColor: "#0B0F19",
        borderRadius: "8px",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.12)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6366F1",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6366F1",
        },
        "& input": {
            color: "#F9FAFB",
            fontSize: "0.9rem",
            py: 1.2,
        },
    },
    actionRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 1.5,
        pt: 1.5,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    },
    saveButton: {
        backgroundColor: "#6366F1",
        color: "#FFFFFF",
        fontWeight: 600,
        textTransform: "none",
        borderRadius: "8px",
        px: 2.5,
        "&:hover": {
            backgroundColor: "#4F46E5",
        },
    },
    cancelButton: {
        color: "#9CA3AF",
        textTransform: "none",
        "&:hover": {
            color: "#F9FAFB",
        },
    },
});
