import { createFileRoute } from "@tanstack/react-router";
import { PortfolioShell } from "@/components/portfolio/PortfolioShell";
import { About, Skills } from "@/components/portfolio/About";
import { Marquee } from "@/components/portfolio/PortfolioUtils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Naaga Sumukh B S" },
      {
        name: "description",
        content:
          "About Naaga Sumukh B S — AI/ML engineer, NMIT Bengaluru. Skills, story, and how I work.",
      },
      { property: "og:title", content: "About — Naaga Sumukh B S" },
      {
        property: "og:description",
        content: "About me, my skills and how I build intelligent systems.",
      },
      { property: "og:url", content: "https://naagasumukh.engineer/about" },
    ],
    links: [{ rel: "canonical", href: "https://naagasumukh.engineer/about" }],
  }),
  component: () => (
    <PortfolioShell>
      <h1 className="sr-only">About Naaga Sumukh B S</h1>
      <About />
      <Marquee reverse />
      <Skills />
    </PortfolioShell>
  ),
});
