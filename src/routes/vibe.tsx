import { createFileRoute } from "@tanstack/react-router";
import { PortfolioShell, Vibe, Marquee } from "./index";

export const Route = createFileRoute("/vibe")({
  head: () => ({
    meta: [
      { title: "Vibe — Naaga Sumukh B S" },
      { name: "description", content: "An interactive playground of shaders, image trails and motion." },
      { property: "og:title", content: "Vibe — Naaga Sumukh B S" },
      { property: "og:description", content: "Shaders, image trails and motion experiments." },
      { property: "og:url", content: "https://naagasumukh.engineer/vibe" },
    ],
    links: [{ rel: "canonical", href: "https://naagasumukh.engineer/vibe" }],
  }),
  component: () => (
    <PortfolioShell>
      <h1 className="sr-only">Motion and Interactive Experiments</h1>
      <Vibe />
      <Marquee reverse />
    </PortfolioShell>
  ),
});
