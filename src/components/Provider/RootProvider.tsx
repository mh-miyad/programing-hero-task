"use client";

import { ReactNode } from "react";

import Navbar from "../Animated/navbar";
import { PageTransition } from "./PageTransition";
import { ThemeProvider } from "./ThemeProvider";

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen w-full relative ">
        <div
          className="absolute inset-0 z-0 dark:hidden"
          style={{
            backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(255, 220, 190, 0.3) 0%, transparent 10%),
        radial-gradient(circle at 80% 20%, rgba(255, 245, 238, 0.35) 0%, transparent 90%),
        radial-gradient(circle at 40% 40%, rgba(255, 210, 180, 0.15) 0%, transparent 10%)`,
          }}
        />

        <div
          className="absolute inset-0 z-0 dark:block hidden"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)",
          }}
        />

        <Navbar />
        <PageTransition>
          <main className="relative z-50 backdrop-blur-2xl bg-transparent transition-all duration-500 ease-linear">
            {children}
          </main>
        </PageTransition>
      </div>
    </ThemeProvider>
  );
};

export default RootProvider;
