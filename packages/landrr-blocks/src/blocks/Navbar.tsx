import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  siteName?: string;
  homeHref?: string;
  links?: NavbarLink[];
  className?: string;
}

export function Navbar({
  siteName = "Site",
  homeHref = "/",
  links = [],
  className,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          to={homeHref}
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          {siteName}
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          {links.map((link, i) => {
            const isExternal = link.href.startsWith("http");
            return isExternal ? (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={i}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
