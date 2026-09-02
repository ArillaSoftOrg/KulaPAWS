import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kulapaws",
  description: "Mobile pet grooming and pet-care products.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-[1200px] items-center px-5 py-3 sm:px-8 sm:py-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/brand/logo.jpg"
                alt="Kulapaws"
                width={56}
                height={56}
                className="rounded-full"
                priority
              />
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
