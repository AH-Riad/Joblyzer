"use client";

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/helperAuth";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Desktop links
  const linkClasses =
    "px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200";

  // Mobile links
  const mobileLinkClasses =
    "block px-4 py-3 text-lg font-medium rounded-md transition-all duration-300 hover:bg-blue-200 dark:hover:bg-blue-700 hover:text-blue-900 dark:hover:text-blue-100";

  return (
    <nav className="sticky top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Job Board Logo" width={40} height={40} />
          <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-wider">
            JobLyzer
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
          <Link href="/jobs" className={linkClasses}>
            Browse Jobs
          </Link>
          {session ? (
            <>
              <Link href="/jobs/post" className={linkClasses}>
                Post a Job
              </Link>
              <Link href="/dashboard" className={linkClasses}>
                Dashboard
              </Link>
              <button onClick={logout} className={linkClasses}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className={linkClasses}>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <ModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2 p-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all duration-300"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-2 space-y-2">
          <Link
            href="/jobs"
            className={mobileLinkClasses}
            onClick={() => setIsOpen(false)}
          >
            Browse Jobs
          </Link>
          {session ? (
            <>
              <Link
                href="/jobs/post"
                className={mobileLinkClasses}
                onClick={() => setIsOpen(false)}
              >
                Post a Job
              </Link>
              <Link
                href="/dashboard"
                className={mobileLinkClasses}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className={mobileLinkClasses + " w-full text-left"}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className={mobileLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
