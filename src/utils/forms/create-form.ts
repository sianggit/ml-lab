import { zodResolver } from "@hookform/resolvers/zod";
import {
    DefaultValues,
    UseFormProps,
    useForm,
} from "react-hook-form";
import { z } from "zod";

export type FormSchema = z.ZodObject;

export function useCreateForm<TSchema extends FormSchema>(
    schema: TSchema,
    options?: {
        defaultValues?: DefaultValues<z.input<TSchema>>;
        mode?: UseFormProps<z.input<TSchema>>["mode"];
    }
) {
    return useForm<
        z.input<TSchema>,
        unknown,
        z.output<TSchema>
    >({
        resolver: zodResolver(schema),
        defaultValues: options?.defaultValues,
        mode: options?.mode ?? "onBlur",
    });
}

export const createForm = useCreateForm;