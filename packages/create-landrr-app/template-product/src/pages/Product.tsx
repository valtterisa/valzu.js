import { Head } from "@landrr/core";
import { pages } from "../site.config";
import { BlockRenderer } from "./BlockRenderer";

interface ProductProps {
  serverData?: Record<string, unknown>;
}

export async function getServerData() {
  return {
    catalogVersion: "v1",
  };
}

export default function Product({ serverData }: ProductProps) {
  return (
    <>
      <Head
        title="Product"
        description="Our product and features."
        ogTitle="Product"
        ogDescription="Our product and features."
        ogType="website"
      />
      <div className="px-4 py-2 text-sm text-gray-500">
        Catalog: {(serverData?.catalogVersion as string | undefined) ?? "n/a"}
      </div>
      <BlockRenderer entries={pages.product} />
    </>
  );
}
