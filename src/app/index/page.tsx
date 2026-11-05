import type { Metadata } from "next";
import images from "@/data/index.json";
import IndexGrid, { type IndexItem } from "./IndexGrid";

export const metadata: Metadata = {
  title: "Index – Hazar nl",
};

export default function IndexPage() {
  const items: IndexItem[] = images.map((item) => ({ ...item, src: `/index/${item.src}` }));
  return <IndexGrid items={items} />;
}
