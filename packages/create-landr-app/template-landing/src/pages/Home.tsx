import { Head } from "@landr/core";
import { pages } from "../site.config";
import { BlockRenderer } from "./BlockRenderer";

export default function Home() {
  return (
    <>
      <Head
        title="Welcome"
        description="Build something great with Valzu.js."
        ogTitle="Welcome"
        ogDescription="Build something great with Valzu.js."
        ogType="website"
        twitterCard="summary_large_image"
      />
      <BlockRenderer entries={pages.home} />
    </>
  );
}
