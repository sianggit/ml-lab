import { z } from "zod";

export type InferInput<
    T extends z.ZodTypeAny
> = z.input<T>;

export type InferOutput<
    T extends z.ZodTypeAny
> = z.output<T>;

export type InferForm<
    T extends z.ZodTypeAny
> = z.infer<T>;