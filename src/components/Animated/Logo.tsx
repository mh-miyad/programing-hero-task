"use client";

import * as motion from "motion/react-client";
import Link from "next/link";
import { FaFire } from "react-icons/fa";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <Link href={"/"}>
      <motion.div
        className="flex items-center  "
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.4 }}
      >
        <motion.div
          className={`${sizeClasses[size]}  `}
          transition={{ duration: 1.5 }}
        >
          <FaFire className=" size-5 text-sm mt-1" />
        </motion.div>
        {showText && (
          <motion.span
            className={`${textSizeClasses[size]} font-normal capitalize`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            DebateArena
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
}
