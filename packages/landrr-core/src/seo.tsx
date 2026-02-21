import React, { createContext, useContext, useEffect, ReactNode } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonical?: string;
  robots?: string;
  children?: ReactNode;
}

// Context for collecting head data during SSR
interface HeadContextValue {
  heads: SEOProps[];
  addHead: (props: SEOProps) => void;
}

export const HeadContext = createContext<HeadContextValue | null>(null);

/**
 * Provider for collecting head data during SSR
 */
export function HeadProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: HeadContextValue;
}) {
  return <HeadContext.Provider value={value}>{children}</HeadContext.Provider>;
}

/**
 * Creates a head context value for SSR
 */
export function createHeadContext(): HeadContextValue {
  const heads: SEOProps[] = [];
  return {
    heads,
    addHead: (props: SEOProps) => {
      heads.push(props);
    },
  };
}

/**
 * SEO Head component for managing meta tags
 * Works on both server and client side
 */
export function Head({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterSite,
  twitterCreator,
  canonical,
  robots = "index, follow",
  children,
}: SEOProps) {
  const headContext = useContext(HeadContext);

  // During SSR, collect head data
  if (headContext) {
    headContext.addHead({
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      ogType,
      twitterCard,
      twitterSite,
      twitterCreator,
      canonical,
      robots,
    });
  }

  // On the client side, update the document head
  if (typeof window !== "undefined") {
    useEffect(() => {
      if (title) {
        document.title = title;
      }

      const updateOrCreateMeta = (name: string, content: string | undefined) => {
        if (!content) return;
        let meta = document.querySelector(
          `meta[name="${name}"], meta[property="${name}"]`
        ) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement("meta");
          if (name.startsWith("og:") || name.startsWith("twitter:")) {
            meta.setAttribute("property", name);
          } else {
            meta.setAttribute("name", name);
          }
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      updateOrCreateMeta("description", description);
      updateOrCreateMeta("keywords", keywords);
      updateOrCreateMeta("robots", robots);
      updateOrCreateMeta("og:title", ogTitle || title);
      updateOrCreateMeta("og:description", ogDescription || description);
      updateOrCreateMeta("og:image", ogImage);
      updateOrCreateMeta("og:url", ogUrl);
      updateOrCreateMeta("og:type", ogType);
      updateOrCreateMeta("twitter:card", twitterCard);
      updateOrCreateMeta("twitter:site", twitterSite);
      updateOrCreateMeta("twitter:creator", twitterCreator);

      if (canonical) {
        let link = document.querySelector(
          'link[rel="canonical"]'
        ) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement("link");
          link.rel = "canonical";
          document.head.appendChild(link);
        }
        link.href = canonical;
      }
    }, [
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      ogType,
      twitterCard,
      twitterSite,
      twitterCreator,
      canonical,
      robots,
    ]);
  }

  return <>{children}</>;
}

/**
 * Renders collected head data to HTML string for SSR
 */
export function renderHeadToString(heads: SEOProps[]): string {
  // Merge all head data, later values override earlier ones
  const merged = heads.reduce<SEOProps>((acc, head) => ({ ...acc, ...head }), {});

  const tags: string[] = [];

  if (merged.title) {
    tags.push(`<title>${escapeHtml(merged.title)}</title>`);
  }

  if (merged.description) {
    tags.push(`<meta name="description" content="${escapeHtml(merged.description)}">`);
  }

  if (merged.keywords) {
    tags.push(`<meta name="keywords" content="${escapeHtml(merged.keywords)}">`);
  }

  if (merged.robots) {
    tags.push(`<meta name="robots" content="${escapeHtml(merged.robots)}">`);
  }

  // Open Graph tags
  if (merged.ogTitle || merged.title) {
    tags.push(
      `<meta property="og:title" content="${escapeHtml(merged.ogTitle || merged.title || "")}">`
    );
  }

  if (merged.ogDescription || merged.description) {
    tags.push(
      `<meta property="og:description" content="${escapeHtml(merged.ogDescription || merged.description || "")}">`
    );
  }

  if (merged.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(merged.ogImage)}">`);
  }

  if (merged.ogUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(merged.ogUrl)}">`);
  }

  if (merged.ogType) {
    tags.push(`<meta property="og:type" content="${escapeHtml(merged.ogType)}">`);
  }

  // Twitter Card tags
  if (merged.twitterCard) {
    tags.push(`<meta name="twitter:card" content="${escapeHtml(merged.twitterCard)}">`);
  }

  if (merged.twitterSite) {
    tags.push(`<meta name="twitter:site" content="${escapeHtml(merged.twitterSite)}">`);
  }

  if (merged.twitterCreator) {
    tags.push(`<meta name="twitter:creator" content="${escapeHtml(merged.twitterCreator)}">`);
  }

  // Canonical URL
  if (merged.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(merged.canonical)}">`);
  }

  return tags.join("\n    ");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default Head;
