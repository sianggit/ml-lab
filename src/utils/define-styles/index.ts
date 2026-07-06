import { SystemStyleObject } from "@mui/system";
import { Theme } from "@mui/material/styles";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StyleDefinition = SystemStyleObject<Theme> | ((...args: any[]) => SystemStyleObject<Theme>);

export default function defineStyles<T extends Record<string, StyleDefinition>>(styles: T) {
    return styles;
}
