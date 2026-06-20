import { createFileRoute } from "@tanstack/react-router";
import portrait from "@/assets/portrait-avatar.jpg.asset.json";

import { PortfolioShell } from "@/components/portfolio/PortfolioShell";
import { Hero } from "@/components/portfolio/Hero";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Naaga Sumukh B S — AI/ML Engineer | Bengaluru" },
      {
        name: "description",
        content:
          "Portfolio of Naaga Sumukh B S — AI/ML engineer building intelligent systems. NMIT Bengaluru, 2023–2027.",
      },
      { name: "theme-color", content: "#07121F" },
      { property: "og:title", content: "Naaga Sumukh B S — AI/ML Engineer" },
      {
        property: "og:description",
        content: "Building intelligent systems. AI · ML · Automation · Leadership.",
      },
      { property: "og:image", content: portrait.url },
      { property: "og:url", content: "/" },
      { name: "twitter:image", content: portrait.url },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  return (
    <PortfolioShell>
      <Hero />
      <Contact />
    </PortfolioShell>
  );
}

// ============ RE-EXPORTS FOR ROUTE BACKWARD-COMPATIBILITY ============
export { PortfolioShell } from "@/components/portfolio/PortfolioShell";
export { Hero } from "@/components/portfolio/Hero";
export { About, Skills, SkillsChips, Education } from "@/components/portfolio/About";
export { Projects, Live3D } from "@/components/portfolio/Work";
export { Journey, Experience, Recognition, Certs, Testimonials } from "@/components/portfolio/Journey";
export { Vibe, Achievements } from "@/components/portfolio/Vibe";
export { Contact } from "@/components/portfolio/Contact";
export { Marquee } from "@/components/portfolio/PortfolioUtils";
