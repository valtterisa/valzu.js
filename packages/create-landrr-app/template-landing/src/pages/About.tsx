import { Head } from "@landrr/core";
import { pages } from "../site.config";
import { BlockRenderer } from "./BlockRenderer";

export default function About() {
  return (
    <>
      <Head
        title="About"
        description="Learn more about us."
        ogTitle="About"
        ogDescription="Learn more about us."
        ogType="website"
      />
      <BlockRenderer entries={pages.about} />
    </>
  );
}
