import {
    useFormContext,
    useWatch,
} from "react-hook-form";

export function useFormValues<
    T extends Record<string, unknown>
>() {
    const { control } =
        useFormContext<T>();

    return useWatch({
        control,
    });
}