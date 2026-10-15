import Link from "next/link";
import { siteConfig } from "@/lib/constants";

const Navbar = () => (
  <header className="w-full bg-figma-header">
    <nav
      aria-label="التنقل الرئيسي"
      className="mx-auto flex h-[56px] max-w-7xl items-center justify-between px-4 sm:h-[60px] sm:px-6 lg:h-[70px] lg:px-8"
    >
      <Link
        href="/"
        className="font-sacramento text-2xl leading-none text-figma-text sm:text-3xl lg:text-[35px]"
      >
        shimaa clinic
      </Link>

      <Link
        href={siteConfig.bookingUrl}
        className="flex h-8 items-center border border-black/20 justify-center rounded-full bg-white px-4 py-5 font-tajawal text-sm font-extrabold text-figma-text transition hover:opacity-90 sm:h-9 sm:px-5 sm:text-base lg:h-[29px] lg:px-5 lg:text-[18px]"
      >
        احجزي الان
      </Link>
    </nav>
  </header>
);

export default Navbar;