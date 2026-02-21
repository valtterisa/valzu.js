import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../lib/utils";

export interface FeatureItem {
  title: string;
  description?: string;
}

export interface FeatureGridProps {
  heading?: string;
  items?: FeatureItem[];
  className?: string;
}

const defaultItems: FeatureItem[] = [
  { title: "Fast", description: "Lightning-fast performance." },
  { title: "Simple", description: "Easy to use and customize." },
  { title: "Flexible", description: "Full control over your site." },
];

export function FeatureGrid({
  heading = "Features",
  items = defaultItems,
  className,
}: FeatureGridProps) {
  return (
    <section
      className={cn(
        "w-full py-16 px-6 bg-muted/30",
        className
      )}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          {heading}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">{item.title}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
