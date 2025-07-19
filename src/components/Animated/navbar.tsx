"use client";
import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeButton } from "./ThemeToggler";
const Navbar = () => {
  return (
    <header className="h-20 w-full flex items-center   backdrop-blur-lg bg-transparent  border-b border-gray-100 shadow">
      <nav className="max-w-[1560px] mx-auto px-4 flex items-center justify-between w-full ">
        <div>
          <Logo />
        </div>
        <div>
          <ul className="flex gap-4 items-center">
            <li>
              <Link href={"/create-debate"}>Create Debate</Link>
            </li>
            <li>
              <Link href={"/scoreboard"}>Scoreboard</Link>
            </li>
            <li>
              <Link href={"/people"}>People</Link>
            </li>
          </ul>
        </div>
        <div>
          <ThemeButton />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
