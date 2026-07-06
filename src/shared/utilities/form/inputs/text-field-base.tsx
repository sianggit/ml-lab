import TextField, { TextFieldProps } from "@mui/material/TextField";

export type TextFieldBaseProps = TextFieldProps;

export default function TextFieldBase(props: TextFieldBaseProps) {
    return <TextField fullWidth {...props} />;
}
