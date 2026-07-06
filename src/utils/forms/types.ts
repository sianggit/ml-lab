import { UseFormReturn, DefaultValues } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "./create-form";

export interface FormProps<TSchema extends FormSchema> {
    schema: TSchema;
    defaultValues?: DefaultValues<z.input<TSchema>>;
    mode?: "onBlur" | "onChange" | "onSubmit" | "all";
    onSubmit: (data: z.output<TSchema>) => void | Promise<void>;
    children:
        | React.ReactNode
        | ((methods: UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>>) => React.ReactNode);
}