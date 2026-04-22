import { Head } from "@landrr/core";
import { pages } from "../site.config";
import { BlockRenderer } from "./BlockRenderer";

interface AboutProps {
  serverData?: Record<string, unknown>;
}

export async function getServerData() {
  return {
    framework: "landrr",
  };
}

export default function About({ serverData }: AboutProps) {
  return (
    <>
      <Head
        title="About"
        description="Learn more about us."
        ogTitle="About"
        ogDescription="Learn more about us."
        ogType="website"
      />
      <div className="px-4 py-2 text-sm text-gray-500">
        Loader value: {(serverData?.framework as string | undefined) ?? "n/a"}
      </div>
      <BlockRenderer entries={pages.about} />
    </>
  );
}
