"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { FiMoon, FiSun } from "react-icons/fi";

export function ThemeButton() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
    >
      {theme === "light" ? (
        <FiMoon className="h-4 w-4" />
      ) : (
        <FiSun className="h-4 w-4" />
      )}
    </Button>
  );
}
