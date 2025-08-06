"use client";

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Job Board Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="px-3 text-xl font-bold text-primary font-mono tracking-wider">
                JobLyzer
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link
              href="/jobs"
              className="text-dark-900 hover:text-dark-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Jobs
            </Link>
            <>
              <Link
                href="/jobs/post"
                className="text-dark-600 hover:text-dark-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Post a Job
              </Link>
              <Link
                href="/dashboard"
                className="text-dark-600 hover:text-dark-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <button className="text-dark-600 hover:text-dark-900 px-3 py-2 rounded-md text-sm font-medium">
                Sign Out
              </button>
            </>
            <Link
              href="/auth/signin"
              className="text-dark-600 hover:text-dark-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
