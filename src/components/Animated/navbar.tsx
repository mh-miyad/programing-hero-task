// components/common/Navbar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeButton } from "./ThemeToggler";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className="h-20 w-full flex items-center backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <nav className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-4 items-center">
            <li>
              <Link
                href="/create-debate"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Create Debate
              </Link>
            </li>
            <li>
              <Link
                href="/scoreboard"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Scoreboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.user?.image || "/placeholder.svg"}
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
          <ThemeButton />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeButton />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {status === "authenticated" && (
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || "/placeholder.svg"}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                )}
                <nav className="flex flex-col gap-2">
                  <Button asChild variant="ghost" className="justify-start">
                    <Link
                      href="/create-debate"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Debate
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link
                      href="/scoreboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Scoreboard
                    </Link>
                  </Button>
                  {status === "authenticated" ? (
                    <>
                      <Button asChild variant="ghost" className="justify-start">
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-red-600 hover:text-red-700"
                        onClick={async () => {
                          await handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <Button asChild variant="ghost" className="justify-start">
                      <Link
                        href="/api/auth/signin"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
