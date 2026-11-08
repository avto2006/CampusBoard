"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import AddModal from "@/components/add-modal";

const LINKS = [
  { href: "/?tab=events", label: "Events" },
  { href: "/?tab=teammates", label: "Teammates" },
];

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
            Campus<span className="text-emerald-500">Board</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add event
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default Navbar;