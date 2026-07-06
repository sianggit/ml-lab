import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import SelectBase, { SelectBaseProps } from "../inputs/select-base";

interface FormSelectProps<T extends FieldValues> extends Omit<SelectBaseProps, "value" | "onChange"> {
    name: Path<T>;
}

export default function FormSelect<T extends FieldValues>({ name, ...props }: FormSelectProps<T>) {
    const { control } = useFormContext<T>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <SelectBase
                    {...props}
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
}
