export const scrollTo = (ref: React.RefObject<HTMLDivElement | null> | null) => {
    if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
    }
};
