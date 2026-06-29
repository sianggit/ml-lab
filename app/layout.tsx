import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

export const metadata = { title: "Next JS App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className={cormorant.className}>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
