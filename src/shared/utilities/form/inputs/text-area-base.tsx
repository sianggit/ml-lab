import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export type TextAreaBaseProps = TextFieldProps & {
    rows?: number;
};

export default function TextAreaBase({ rows = 6, ...props }: TextAreaBaseProps) {
    return <TextField {...props} fullWidth multiline rows={rows} />;
}
