"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LoginDialog } from "./login-dialog"
import { RegisterDialog } from "./register-dialog"

export function NavBar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Peerawat</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/about" ? "text-foreground" : "text-foreground/60"
            )}
          >
            About
          </Link>
          <Link
            href="/projects"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/projects" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/contact" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Contact
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-2">
          <LoginDialog />
          <RegisterDialog />
        </div>
      </div>
    </header>
  )
}

