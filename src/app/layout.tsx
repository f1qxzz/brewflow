import type { Metadata } from "next";
import { Inter, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-display" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Brew & Co. - Digital Menu",
  description: "Scan QR untuk lihat menu & pesan langsung dari meja",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F3" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

/* ponytail: jalan sebelum paint biar gak ada kedip terang pas buka di mode gelap */
const THEME_INIT = `try{var t=localStorage.getItem("brewflow:theme");if(t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${archivo.variable} ${jetbrains.variable} h-full`}>
      {/* ponytail: extension browser suka suntik atribut (mis. bis_register) ke <body> sebelum hydrate */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {children}
      </body>
    </html>
  );
}
