import React from "react";

export type IconName =
    | "play"
    | "arrow-down"
    | "arrow-up"
    | "arrow-left"
    | "arrow-right"
    | "check"
    | "chart-bar"
    | "chart-line"
    | "settings"
    | "zap"
    | "lightbulb"
    | "download"
    | "code"
    | "file-text"
    | "command"
    | "search"
    | "academic-cap"
    | "microscope"
    | "target"
    | "tree"
    | "network"
    | "circle-dot"
    | "book-open"
    | "clock"
    | "menu"
    | "x"
    | "info"
    | "alert-triangle"
    | "rotate-ccw"
    | "upload"
    | "database"
    | "trash"
    | "table"
    | "filter"
    | "sliders"
    | "printer"
    | "file-pdf";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number | string;
    color?: string;
    className?: string;
    title?: string;
    "aria-label"?: string;
}
