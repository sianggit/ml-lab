import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import TextAreaBase, { TextAreaBaseProps } from "../inputs/text-area-base";

interface FormTextAreaProps<T extends FieldValues> extends Omit<TextAreaBaseProps, "value" | "onChange"> {
    name: Path<T>;
}

export default function FormTextArea<T extends FieldValues>({ name, ...props }: FormTextAreaProps<T>) {
    const { control } = useFormContext<T>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextAreaBase
                    {...props}
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
}
