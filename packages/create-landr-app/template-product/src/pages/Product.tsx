import { Head } from "@landr/core";
import { pages } from "../site.config";
import { BlockRenderer } from "./BlockRenderer";

export default function Product() {
  return (
    <>
      <Head
        title="Product"
        description="Our product and features."
        ogTitle="Product"
        ogDescription="Our product and features."
        ogType="website"
      />
      <BlockRenderer entries={pages.product} />
    </>
  );
}
