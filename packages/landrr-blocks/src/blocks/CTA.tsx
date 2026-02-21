import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export interface CTAProps {
  title?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export function CTA({
  title = "Ready to get started?",
  buttonText = "Contact us",
  buttonHref = "/contact",
  className,
}: CTAProps) {
  const isExternal = buttonHref.startsWith("http");
  return (
    <section
      className={cn(
        "w-full py-20 px-6 bg-primary text-primary-foreground",
        className
      )}
    >
      <div className="mx-auto max-w-2xl text-center space-y-8">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        {isExternal ? (
          <a href={buttonHref} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {buttonText}
            </Button>
          </a>
        ) : (
          <Link to={buttonHref}>
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
