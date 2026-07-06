// validation/messages.ts

export const errorMessages = {
    required: (field: string) => `${field} wajib diisi`,
    email: "Format email tidak valid",
    minLength: (field: string, min: number) =>
        `${field} minimal ${min} karakter`,
    maxLength: (field: string, max: number) =>
        `${field} maksimal ${max} karakter`,
};