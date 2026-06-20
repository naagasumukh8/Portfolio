import { createFileRoute } from "@tanstack/react-router";
import { PortfolioShell, Contact } from "./index";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Naaga Sumukh B S" },
      { name: "description", content: "Get in touch with Naaga Sumukh B S — AI/ML engineer, Bengaluru." },
      { property: "og:title", content: "Contact — Naaga Sumukh B S" },
      { property: "og:description", content: "Let's build something." },
      { property: "og:url", content: "https://naagasumukh.engineer/contact" },
    ],
    links: [{ rel: "canonical", href: "https://naagasumukh.engineer/contact" }],
  }),
  component: () => (
    <PortfolioShell>
      <h1 className="sr-only">Contact Information</h1>
      <Contact />
    </PortfolioShell>
  ),
});
