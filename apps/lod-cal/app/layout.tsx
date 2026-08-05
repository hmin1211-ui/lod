import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "어둠의전설 데미지 계산기",
  description: "크래셔와 메테오 데미지를 계산하고 허수아비 데미지를 역산하는 웹 계산기입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
