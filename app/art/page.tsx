import type { Metadata } from "next";
import ArtPageClient from "./ArtPageClient";

export const metadata: Metadata = {
  title: "Art | JQ",
};

export default function ArtPage() {
  return <ArtPageClient />;
}
