import { createFileRoute } from "@tanstack/react-router";
import { PortfolioShell, Journey, Marquee, Recognition, Certs } from "./index";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey — Naaga Sumukh B S" },
      {
        name: "description",
        content: "Timeline, recognition and credentials of Naaga Sumukh B S.",
      },
      { property: "og:title", content: "Journey — Naaga Sumukh B S" },
      { property: "og:description", content: "Timeline, recognition and credentials." },
      { property: "og:url", content: "https://naagasumukh.engineer/journey" },
    ],
    links: [{ rel: "canonical", href: "https://naagasumukh.engineer/journey" }],
  }),
  component: () => (
    <PortfolioShell>
      <h1 className="sr-only">Professional Journey and Recognition</h1>
      <Journey />
      <Marquee />
      <Recognition />
      <Certs />
    </PortfolioShell>
  ),
});
