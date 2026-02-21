export { Hero } from "./blocks/Hero";
export type { HeroProps } from "./blocks/Hero";
export { FeatureGrid } from "./blocks/FeatureGrid";
export type { FeatureGridProps, FeatureItem } from "./blocks/FeatureGrid";
export { CTA } from "./blocks/CTA";
export type { CTAProps } from "./blocks/CTA";
export { Footer } from "./blocks/Footer";
export type { FooterProps, FooterLink } from "./blocks/Footer";
export { Navbar } from "./blocks/Navbar";
export type { NavbarProps, NavbarLink } from "./blocks/Navbar";
export { Button, buttonVariants } from "./components/ui/button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";

import type { ComponentType } from "react";
import { Hero } from "./blocks/Hero";
import { FeatureGrid } from "./blocks/FeatureGrid";
import { CTA } from "./blocks/CTA";
import { Footer } from "./blocks/Footer";
import { Navbar } from "./blocks/Navbar";

export type BlockMap = Record<
  string,
  ComponentType<Record<string, unknown>>
>;

export const blockMap: BlockMap = {
  hero: Hero as ComponentType<Record<string, unknown>>,
  featureGrid: FeatureGrid as ComponentType<Record<string, unknown>>,
  cta: CTA as ComponentType<Record<string, unknown>>,
  footer: Footer as ComponentType<Record<string, unknown>>,
  navbar: Navbar as ComponentType<Record<string, unknown>>,
};
