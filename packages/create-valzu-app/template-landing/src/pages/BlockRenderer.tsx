import * as React from "react";
import { blockMap } from "valzu-blocks";

type PageEntry = string | { block: string; [key: string]: unknown };

interface BlockRendererProps {
  entries: readonly PageEntry[];
}

export function BlockRenderer({ entries }: BlockRendererProps) {
  return (
    <>
      {entries.map((entry, i) => {
        const blockId = typeof entry === "string" ? entry : entry.block;
        const props = typeof entry === "string" ? {} : { ...entry, block: undefined };
        const Block = blockMap[blockId];
        if (!Block) return null;
        return <Block key={i} {...props} />;
      })}
    </>
  );
}
