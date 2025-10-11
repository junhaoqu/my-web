import type { Metadata } from "next";
import PhotoPageClient from "./PhotoPageClient";

export const metadata: Metadata = {
  title: "Photo | JQ",
};

export default function PhotoPage() {
  return <PhotoPageClient />;
}
