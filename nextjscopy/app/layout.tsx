import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";



export const metadata: Metadata = {
  title: "WorkWell",
  description: "App to help you work well",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="bg-slate-800 flex justify-end">
            <SignedOut >
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          <main className="min-h-screen bg-gray-800">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
