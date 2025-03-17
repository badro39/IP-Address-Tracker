import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-Rubik",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "IP Address Tracker",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <header>
        <link rel="icon" href="/favicon-32x32.png" sizes="any" />
      </header>
      <body className={`${rubik.variable}`} style={{ maxHeight: "100dvh" }}>
        {children}
      </body>
    </html>
  );
}
