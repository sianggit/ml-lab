"use client";

import { useMemo } from "react";
import katex from "katex";
import Box, { BoxProps } from "@mui/material/Box";

export interface MathFormulaProps extends Omit<BoxProps, "children"> {
    formula: string;
    displayMode?: boolean;
}

export default function MathFormula({
    formula,
    displayMode = true,
    sx,
    className,
    ...props
}: MathFormulaProps) {
    const renderedHtml = useMemo(() => {
        try {
            return katex.renderToString(formula, {
                displayMode,
                throwOnError: false,
                output: "htmlAndMathml",
            });
        } catch (err) {
            console.warn("[MathFormula] KaTeX rendering failed for formula:", formula, err);
            return formula;
        }
    }, [formula, displayMode]);

    return (
        <Box
            className={className}
            sx={{
                display: "block",
                overflowX: "auto",
                overflowY: "hidden",
                py: 0.5,
                px: 1,
                color: "#F5F7FA",
                "& .katex-display": {
                    margin: "0.2em 0",
                    overflowX: "auto",
                    overflowY: "hidden",
                },
                "& .katex": {
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    color: "inherit",
                },
                ...sx,
            }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
            {...props}
        />
    );
}
