"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Menu, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import AddModal from "@/components/AddModal";

const LINKS = [
  { href: "/?tab=events", label: "Events", tab: "events" },
  { href: "/?tab=teammates", label: "Find a teammate", tab: "teammates" },
];

function NavbarContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "events";
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <nav aria-label="Main" className="max-w-6xl mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          {/* LOGO */}
          <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            <span className="text-slate-900 dark:text-white">Campus</span>
            <span className="text-emerald-500">Board</span>
          </Link>

          {/* NAVIGATION LINKS */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const isActive = currentTab === l.tab;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors",
                      isActive && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="hidden items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 px-4 py-2 text-sm font-bold text-white dark:text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer sm:inline-flex"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> Add event
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div id="mobile-menu" className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-4 md:hidden space-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white dark:text-slate-950"
            >
              <Plus className="h-4 w-4" /> Add event
            </button>
          </div>
        )}
      </header>

      {/* ADD MODAL COMPONENT */}
      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800" />}>
      <NavbarContent />
    </Suspense>
  );
}