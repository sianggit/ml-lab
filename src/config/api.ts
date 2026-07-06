// Fill in your actual API base URL and endpoints. Every helper in
// src/helper/* imports from here rather than hardcoding URLs.
const URL_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = {
    auth: `${URL_API_BASE}auth/`,

    // Add your own endpoints here, e.g.:
    // users: `${URL_API_BASE}users/`,
};
