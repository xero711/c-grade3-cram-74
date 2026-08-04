import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host");
  const protocol = incoming.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const base = host ? `${protocol}://${host}` : "http://localhost:3000";
  const image = `${base}/og.png`;

  return {
    title: "C言語3級 一夜漬け74問",
    description: "第63回・第67回の問題と答えを、1行の根拠まで流し見できる試験直前用サイト。",
    openGraph: {
      title: "C言語3級 一夜漬け74問",
      description: "問題を流す。答えを隠す。迷ったところだけ、もう一度。",
      type: "website",
      images: [{ url: image, width: 1736, height: 907, alt: "C言語3級 一夜漬け74問" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "C言語3級 一夜漬け74問",
      description: "第63回・第67回を直前復習。",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
