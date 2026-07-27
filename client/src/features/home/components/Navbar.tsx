"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = ["Features", "Templates", "Docs", "Pricing"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-border transition-shadow duration-300 ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      <div className="container h-16 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-primary tracking-tight">
            Foliora
          </span>

          <div className="hidden md:flex gap-6 ml-12">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-textMuted hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 text-primary hover:bg-surfaceAlt rounded-lg transition cursor-pointer"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Log In
          </button>

          <button
            className="bg-primary text-white px-6 py-2 rounded-lg shadow-card hover:opacity-90 transition cursor-pointer"
            onClick={() => {
              window.location.href = "/signup";
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
