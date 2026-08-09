import type { Metadata } from "next";
import "./hero.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "دیکا آسیا | پارتیشن اداری",
  description: "طراحی، تولید و اجرای تخصصی پارتیشن‌های اداری",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body id="top">{children}</body>
    </html>
  );
}
