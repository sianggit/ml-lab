import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

export interface CheckboxBaseProps {
    label?: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (
        checked: boolean
    ) => void;
}

export default function CheckboxBase({
    label,
    checked,
    disabled,
    onChange,
}: CheckboxBaseProps) {
    return (
        <FormControlLabel
            label={
                typeof label ===
                    "string" ? (
                    <Typography>
                        {label}
                    </Typography>
                ) : (
                    label
                )
            }
            control={
                <Checkbox
                    checked={!!checked}
                    disabled={disabled}
                    onChange={(
                        _,
                        value
                    ) =>
                        onChange?.(
                            value
                        )
                    }
                />
            }
        />
    );
}