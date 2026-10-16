import { siteConfig } from "@/lib/constants";
import Image from "next/image";

const Footer = () => (
  <footer className="mt-12 w-full py-10 pb-28 text-center lg:pb-10">
    {/* Availability */}
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4">
      <span className="h-px flex-1 bg-figma-divider/30" />
      <p className="font-tajawal text-sm text-figma-textMut">
        متاح 6 ايام في الاسبوع
      </p>
      <span className="h-px flex-1 bg-figma-divider/30" />
    </div>

    {/* Logo */}
    <div className="mt-6 flex justify-center items-center font-sacramento text-4xl text-figma-footer sm:text-5xl">
       <Image
          src="/logo.png"
          alt="Logo"
          width={300}
          height={88}
          className="h-24 w-auto sm:h-10 lg:h-12"
          priority
        />
    </div>

    {/* Socials — inline SVG (brand icons removed from lucide-react) */}
    <div className="mt-6 flex items-center justify-center gap-6">
      {/* Facebook */}
      <a
        href={siteConfig.facebook}
        aria-label="Facebook"
        className="text-figma-textMut transition hover:text-figma-header"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      </a>

      {/* Instagram */}
      <a
        href={siteConfig.instgrame}
        aria-label="Instagram"
        className="text-figma-textMut transition hover:text-figma-header"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>

      {/* TikTok */}
      <a
        href={siteConfig.tiktok}
        aria-label="TikTok"
        className="text-figma-textMut transition hover:text-figma-header"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.7V11a8.5 8.5 0 0 1-4.5-1.3v6.05A6.25 6.25 0 1 1 10.25 9.5c.26 0 .51.02.75.06v3.4a2.85 2.85 0 1 0 2.1 2.75V3h3.4Z" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        href={siteConfig.whatsapp}
        aria-label="WhatsApp"
        className="text-figma-textMut transition hover:text-figma-header"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 3a9 9 0 0 0-7.74 13.6L3 21l4.55-1.2A9 9 0 1 0 12 3z" />
          <path d="M8.5 9.2c0 3 2.4 5.4 5.4 5.4.6 0 1.1-.5 1.1-1.1 0-.2-.1-.4-.2-.5l-1.1-.9c-.2-.2-.4-.2-.6-.1l-.6.4c-.9-.5-1.6-1.2-2.1-2.1l.4-.6c.1-.2.1-.5-.1-.6l-.9-1.1c-.1-.2-.3-.3-.5-.3-.6 0-1.1.5-1.1 1.1z" />
        </svg>
      </a>
    </div>

    {/* Copyright */}
    <p className="mt-6 font-tajawal text-sm text-figma-textMut">
      © {new Date().getFullYear()} shimaa clinic
    </p>
  </footer>
);

export default Footer;