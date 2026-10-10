import React from "react";
import { IconProps } from "./icon.types";
import { ICON_REGISTRY } from "./icon-registry";

export * from "./icon.types";

export default function IconComponent({
    name,
    size = 18,
    color = "currentColor",
    className,
    style,
    title,
    "aria-label": ariaLabel,
    ...rest
}: IconProps) {
    const iconContent = ICON_REGISTRY[name];

    if (!iconContent) {
        if (process.env.NODE_ENV !== "production") {
            console.warn(`[IconComponent] Unknown icon name: "${name}"`);
        }
        return null;
    }

    const isAccessible = !!(title || ariaLabel);

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            className={className}
            style={{
                display: "inline-block",
                verticalAlign: "middle",
                flexShrink: 0,
                ...style,
            }}
            role={isAccessible ? "img" : undefined}
            aria-label={ariaLabel || title}
            aria-hidden={!isAccessible ? true : undefined}
            {...rest}
        >
            {title && <title>{title}</title>}
            {iconContent}
        </svg>
    );
}
