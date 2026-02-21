import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function Hero({
  title = "Welcome",
  subtitle = "Build something great.",
  ctaText = "Get started",
  ctaHref = "/",
  className,
}: HeroProps) {
  const isExternal = ctaHref.startsWith("http");
  return (
    <section
      className={cn(
        "relative w-full py-24 px-6 md:py-32 lg:py-40",
        "bg-background text-foreground",
        className
      )}
    >
      <div className="mx-auto max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {ctaText && (
          <div className="flex flex-wrap gap-4 justify-center">
            {isExternal ? (
              <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-base px-8">
                  {ctaText}
                </Button>
              </a>
            ) : (
              <Link to={ctaHref}>
                <Button size="lg" className="text-base px-8">
                  {ctaText}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
