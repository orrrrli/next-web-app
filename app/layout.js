import localFont from "next/font/local";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import Navbar from "@/components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  title: "Fake Store",
  description: "A fake store for testing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary`}
      >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <ReduxProvider>
          <Navbar className="fixed-navbar" />
          <main className="main-content">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
