import { FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { createForm, FormSchema } from "./create-form";
import { FormProps } from "./types";

export function Form<TSchema extends FormSchema>({
    schema,
    defaultValues,
    mode,
    onSubmit,
    children,
}: FormProps<TSchema>) {
    const methods = createForm(schema, {
        defaultValues,
        mode,
    });

    const handleSubmit: SubmitHandler<z.output<TSchema>> = async (data) => {
        return onSubmit(data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
                {typeof children === "function"
                    ? children(methods)
                    : children}
            </form>
        </FormProvider>
    );
}