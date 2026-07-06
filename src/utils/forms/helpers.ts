export function removeEmptyValues<
    T extends Record<string, unknown>
>(data: T) {
    return Object.fromEntries(
        Object.entries(data).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== ""
        )
    ) as Partial<T>;
}

export function normalizePayload<
    T extends Record<string, unknown>
>(data: T) {
    return removeEmptyValues(data);
}