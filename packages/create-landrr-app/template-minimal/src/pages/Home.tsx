import { Head } from "@landrr/core";
import { pages } from "../site.config";
import { BlockRenderer } from "./BlockRenderer";

export default function Home() {
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
      <BlockRenderer entries={pages.home} />
    </>
  );
}
