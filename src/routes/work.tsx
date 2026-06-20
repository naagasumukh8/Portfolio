import { createFileRoute } from "@tanstack/react-router";
import { PortfolioShell, Projects, Marquee, Live3D } from "./index";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Naaga Sumukh B S" },
      { name: "description", content: "Selected work — AI, ML, automation and interactive experiments by Naaga Sumukh B S." },
      { property: "og:title", content: "Work — Naaga Sumukh B S" },
      { property: "og:description", content: "Selected projects across AI/ML, automation, and interactive 3D." },
      { property: "og:url", content: "https://naagasumukh.lovable.app/work" },
    ],
    links: [{ rel: "canonical", href: "https://naagasumukh.lovable.app/work" }],
  }),
  component: () => (
    <PortfolioShell>
      <h1 className="sr-only">Selected Projects and Work</h1>
      <Projects />
      <Marquee />
      <Live3D />
    </PortfolioShell>
  ),
});
