// validation/schemas/contact.schema.ts
import { createSchema } from "../schemaFactory";
import { requiredString, email, phone } from "../rules";

export const contactSchema = createSchema({
    fullName: requiredString("Full name"),
    email: email("Email"),
    phone: phone("Phone number"),
    need: requiredString("Need"),
    description: requiredString("Description"),
});