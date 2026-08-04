import type { Metadata } from "next";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const siteUrl = isGitHubPages
  ? "https://xero711.github.io/c-grade3-cram-74"
  : "https://c-grade3-cram-74.rei711.chatgpt.site";
const image = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "C言語3級 一夜漬け74問",
  description: "第63回・第67回の問題と答えを、1行の根拠まで流し見できる試験直前用サイト。",
  openGraph: {
    title: "C言語3級 一夜漬け74問",
    description: "問題を流す。答えを隠す。迷ったところだけ、もう一度。",
    url: siteUrl,
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
