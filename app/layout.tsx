import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Imagine — AI image studio",
  description: "Create and revisit your AI-generated images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/">
              <span className="brand-mark"><img src="/logo.avif" alt="Imagine" /></span>
              <span>Imagine</span>
            </Link>
            <nav className="site-nav" aria-label="Main navigation">
              <Link href="/chat">Create</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
