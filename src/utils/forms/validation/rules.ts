// validation/rules.ts
import { z } from "zod";
import { errorMessages } from "./messages";

export const requiredString = (label: string) =>
    z.string().min(1, errorMessages.required(label));

export const email = (label = "Email") =>
    z.email(errorMessages.email).or(
        z.string().min(1, errorMessages.required(label))
    );

export const phone = (label = "Phone") =>
    z
        .string()
        .min(1, errorMessages.required(label))
        .regex(/^[0-9+]+$/, "Format nomor tidak valid");

export const minString = (label: string, min: number) =>
    z.string().min(min, errorMessages.minLength(label, min));

export const maxString = (label: string, max: number) =>
    z.string().max(max, errorMessages.maxLength(label, max));

export const optionalString = () =>
    z.string().optional();