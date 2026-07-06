"use client";

import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

interface AppModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    showCloseButton?: boolean;
}

export default function AppModal({ open, onClose, children, maxWidth = "sm", showCloseButton = true }: AppModalProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (isMobile) {
        return (
            <Drawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                slotProps={{
                    backdrop: { sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" } },
                    paper: { sx: { borderRadius: "20px 20px 0 0", height: "auto", position: "absolute" } },
                }}
            >
                <Box sx={{ width: 40, height: 4, borderRadius: "4px", background: "#D9D9D9", mx: "auto", mt: "12px", mb: "4px" }} />
                {showCloseButton && (
                    <IconButton onClick={onClose} sx={{ position: "absolute", top: 16, right: 12, zIndex: 1, color: "text.secondary" }} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                )}
                {children}
            </Drawer>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth
            slotProps={{
                backdrop: { sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" } },
                paper: { sx: { borderRadius: "16px", position: "relative", p: 0 } },
            }}
        >
            {showCloseButton && (
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 16, right: 12, zIndex: 1, color: "white" }} aria-label="close">
                    <CloseIcon />
                </IconButton>
            )}
            {children}
        </Dialog>
    );
}
