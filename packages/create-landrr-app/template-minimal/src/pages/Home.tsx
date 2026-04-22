import { Head } from "@landrr/core";
import { pages } from "../site.config";
import { BlockRenderer } from "./BlockRenderer";

interface HomeProps {
  serverData?: Record<string, unknown>;
}

export async function getServerData() {
  return {
    renderedAt: new Date().toISOString(),
  };
}

export default function Home({ serverData }: HomeProps) {
  return (
    <>
      <Head
        title="Welcome"
        description="A minimal start with Valzu.js."
        ogTitle="Welcome"
        ogDescription="A minimal start with Valzu.js."
        ogType="website"
        twitterCard="summary_large_image"
      />
      <div className="px-4 py-2 text-sm text-gray-500">
        SSR timestamp: {(serverData?.renderedAt as string | undefined) ?? "n/a"}
      </div>
      <BlockRenderer entries={pages.home} />
    </>
  );
}
