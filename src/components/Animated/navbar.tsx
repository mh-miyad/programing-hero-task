import { ThemeButton } from "./ThemeToggler";

const Navbar = () => {
  return (
    <header className="h-20 w-full flex items-center   backdrop-blur-lg bg-transparent  border-b border-gray-100 shadow">
      <nav className="max-w-[1560px] mx-auto px-4 flex items-center justify-between">
        <div></div>
        <div></div>
        <div>
          <ThemeButton />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
