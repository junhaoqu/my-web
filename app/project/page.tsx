import type { Metadata } from "next";
import ProjectPageClient from "./ProjectPageClient";

export const metadata: Metadata = {
  title: "Project | JQ",
};

export default function ProjectPage() {
  return <ProjectPageClient />;
}
