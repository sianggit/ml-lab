"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function PageFallback() {
    return (
        <Box sx={{ px: { xs: 2, md: 6 }, py: 8, maxWidth: 1200, mx: "auto" }}>
            <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 2, mb: 4 }} />
            <Skeleton variant="text" height={48} width="60%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={24} width="80%" />
            <Skeleton variant="text" height={24} width="70%" />
        </Box>
    );
}