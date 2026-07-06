const TOKEN_KEY = "token";
const TOKEN_EXP_KEY = "token_exp";

const credential = {
    storage: {
        get(key: string): string | null {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(key);
        },
        set(key: string, value: string) {
            if (typeof window === "undefined") return;
            localStorage.setItem(key, value);
        },
        remove(key: string) {
            if (typeof window === "undefined") return;
            localStorage.removeItem(key);
        },
    },
    isTokenValid(): boolean {
        const token = this.storage.get(TOKEN_KEY);
        const exp = this.storage.get(TOKEN_EXP_KEY);
        if (!token || !exp) return false;
        return Date.now() < Number(exp);
    },
    setToken(token: string, expiresInSeconds: number) {
        this.storage.set(TOKEN_KEY, token);
        // small buffer (30s) so we refresh slightly before actual expiry
        this.storage.set(TOKEN_EXP_KEY, String(Date.now() + (expiresInSeconds - 30) * 1000));
    },
    clearToken() {
        this.storage.remove(TOKEN_KEY);
        this.storage.remove(TOKEN_EXP_KEY);
    },
};

export default credential;
export { TOKEN_KEY };