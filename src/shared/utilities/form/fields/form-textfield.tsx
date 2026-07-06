import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import TextFieldBase from "../inputs/text-field-base";
import { TextFieldProps } from "@mui/material/TextField";

interface Props<T extends FieldValues> extends Omit<TextFieldProps, "name"> {
    name: Path<T>;
}

export default function FormTextField<T extends FieldValues>({ name, ...props }: Props<T>) {
    const { control } = useFormContext<T>();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <TextFieldBase
                    {...field}
                    {...props}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
}
