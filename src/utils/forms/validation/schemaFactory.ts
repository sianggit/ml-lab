// validation/schemaFactory.ts
import { z } from "zod";

export const createSchema = <T extends z.ZodRawShape>(shape: T) => {
    return z.object(shape);
};