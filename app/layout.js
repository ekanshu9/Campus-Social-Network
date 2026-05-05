import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Peer View",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "black", color: "white" }}
      >
        <Toaster position="top-right" />
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
