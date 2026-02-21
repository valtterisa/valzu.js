import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  copyright?: string;
  links?: FooterLink[];
  className?: string;
}

export function Footer({
  copyright = "© 2025 My App. All rights reserved.",
  links = [],
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "w-full py-12 px-6 border-t border-border bg-muted/30",
        className
      )}
    >
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">{copyright}</p>
        {links.length > 0 && (
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            {links.map((link, i) => {
              const isExternal = link.href.startsWith("http");
              return isExternal ? (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={i}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </footer>
  );
}
