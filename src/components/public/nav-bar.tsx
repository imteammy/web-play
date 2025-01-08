"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LoginDialog } from "./login-dialog";
import { RegisterDialog } from "./register-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ismobile = useIsMobile(635, !open);

  useEffect(() => {
    if (!ismobile && open) {
      setOpen(false);
    }
  }, [open, ismobile]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-2 sm:px-0">
        <a
          href="/"
          className="hidden mr-6 sm:flex items-center space-x-2"
        >
          <span className="font-bold">Peerawat</span>
        </a>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <a
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Home
          </a>
          <Link
            prefetch
            href="/about"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/about" ? "text-foreground" : "text-foreground/60"
            )}
          >
            About
          </Link>
          <Link
            prefetch
            href="/projects"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/projects" ? "text-foreground" : (
                "text-foreground/60"
              )
            )}
          >
            Projects
          </Link>
          <Link
            prefetch
            href="/contact"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/contact" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Contact
          </Link>
        </nav>
        <div className="hidden ml-auto sm:flex items-center space-x-2">
          <LoginDialog />
          <RegisterDialog />
        </div>
        <div className="ml-auto block sm:hidden">
          <DropdownMenu open={open} defaultOpen={open}>
            <DropdownMenuTrigger asChild>
              <EllipsisIcon onClick={() => setOpen(true)} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10}>
              <LoginDialog />
              <RegisterDialog />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
