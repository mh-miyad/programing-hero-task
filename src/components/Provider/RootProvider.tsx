"use client";

import { ReactNode } from "react";

import Navbar from "../Animated/navbar";
import { PageTransition } from "./PageTransition";
import { ThemeProvider } from "./ThemeProvider";

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Navbar />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
      </ThemeProvider>
    </>
  );
};

export default RootProvider;
