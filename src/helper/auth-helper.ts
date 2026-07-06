import BaseHelper from "./base-helper";
import credential from "@/lib/credential";
import { api } from "@/config/api";

class AuthHelper extends BaseHelper {
    static url = api.auth;

    private static loginPromise: Promise<string | null> | null = null;

    static async login(): Promise<string | null> {
        const username = process.env.NEXT_PUBLIC_APP_SERVICE_USERNAME;
        const password = process.env.NEXT_PUBLIC_APP_SERVICE_PASSWORD;

        return new Promise((resolve) => {
            this.postBase(
                "login",
                { username, password },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (response: any) => {
                    const token = response?.data?.data?.token;
                    const expiresIn = response?.data?.data?.expires_in ?? 3600;

                    if (response?.status && token) {
                        credential.setToken(token, expiresIn);
                        resolve(token);
                    } else {
                        resolve(null);
                    }
                },
                { usingToken: false, showSuccess: false, showError: false }
            );
        });
    }

    /**
     * Ensures a valid token exists before any API call.
     * De-duplicates concurrent calls so a burst of requests on page load
     * doesn't trigger multiple simultaneous /login calls.
     */
    static async ensureToken(): Promise<string | null> {
        if (credential.isTokenValid()) {
            return credential.storage.get("token");
        }

        if (!this.loginPromise) {
            this.loginPromise = this.login().finally(() => {
                this.loginPromise = null;
            });
        }

        return this.loginPromise;
    }
}

export default AuthHelper;
