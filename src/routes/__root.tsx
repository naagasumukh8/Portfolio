import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PageTransition } from "../components/PageTransition";
import { TopNav } from "../components/TopNav";
import { SplashLoader } from "../components/SplashLoader";
import { DesktopRecommendation } from "../components/DesktopRecommendation";
import { GlobalPolish } from "../components/GlobalPolish";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#07121F] px-4 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div 
          className="absolute -inset-[20%] opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, rgba(124,110,255,0.22), transparent 70%)",
          }}
        />
      </div>
      
      {/* Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center backdrop-blur-md shadow-2xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl mb-6 text-[#5CBDB9]">
          ⚠️
        </div>
        <h1 className="font-display text-8xl font-bold tracking-tight text-white mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold text-white mb-4">Transmission Lost</h2>
        <p className="font-sans text-sm text-[#8a8a8a] max-w-sm mx-auto mb-8 leading-relaxed">
          The requested route was not recognized or is temporarily unavailable in this sector.
        </p>
        <div className="flex justify-center">
          <Link
            to="/"
            className="glass-pill text-xs font-semibold px-6 py-3 inline-flex items-center justify-center gap-2"
          >
            Return to Core <span className="text-[#5CBDB9]">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // ── Primary SEO ──────────────────────────────────────────────────────────
      { title: "Naaga Sumukh B S | AI/ML Engineer | Bengaluru | naagasumukh.engineer" },
      {
        name: "description",
        content:
          "Naaga Sumukh B S — AI/ML engineer from Bengaluru, India. NMIT B.E. Information Science student building intelligent systems: machine learning, NLP, generative AI, automation. Creator of SacchAI, MediConnect & JobShield. Top 0.095% global LinkedIn rank (Cleve AI 2024). Contact: naagasumukh1@gmail.com.",
      },
      { name: "author", content: "Naaga Sumukh B S" },
      { name: "keywords", content: "Naaga Sumukh, Naaga Sumukh B S, naagasumukh, AI ML engineer Bengaluru, NMIT AI engineer, SacchAI, MediConnect, JobShield, machine learning portfolio, NLP engineer India, generative AI developer" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "theme-color", content: "#07121F" },
      { name: "application-name", content: "Naaga Sumukh — Portfolio" },
      // ── Canonical + alternate ───────────────────────────────────────────────
      { property: "og:url", content: "https://naagasumukh.engineer" },
      // ── Open Graph ──────────────────────────────────────────────────────────
      { property: "og:type", content: "profile" },
      { property: "og:site_name", content: "Naaga Sumukh B S" },
      { property: "og:title", content: "Naaga Sumukh B S — AI/ML Engineer, Bengaluru" },
      {
        property: "og:description",
        content:
          "Portfolio of Naaga Sumukh B S — AI/ML engineer, NMIT Bengaluru. Builds intelligent systems with ML, NLP, Generative AI & automation. SacchAI, MediConnect, JobShield. Top 0.095% LinkedIn rank 2024.",
      },
      {
        property: "og:image",
        content: "https://naagasumukh.engineer/og-image.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Naaga Sumukh B S — AI/ML Engineer Portfolio" },
      { property: "og:locale", content: "en_IN" },
      { property: "profile:first_name", content: "Naaga Sumukh" },
      { property: "profile:last_name", content: "B S" },
      { property: "profile:username", content: "naagasumukh8" },
      // ── Twitter / X ─────────────────────────────────────────────────────────
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@naagasumukh" },
      { name: "twitter:creator", content: "@naagasumukh" },
      { name: "twitter:title", content: "Naaga Sumukh B S | AI/ML Engineer | naagasumukh.engineer" },
      {
        name: "twitter:description",
        content:
          "Portfolio of Naaga Sumukh B S — AI/ML engineer from Bengaluru. Builds with ML, NLP, GenAI & automation. SacchAI · MediConnect · JobShield.",
      },
      {
        name: "twitter:image",
        content: "https://naagasumukh.engineer/og-image.png",
      },
      { name: "twitter:image:alt", content: "Naaga Sumukh B S — AI/ML Engineer Portfolio" },
    ],
    links: [
      { rel: "canonical", href: "https://naagasumukh.engineer" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" },
    ],
    scripts: [
      // ── Person schema — the primary signal Google uses for name queries ────
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://naagasumukh.engineer/#person",
          name: "Naaga Sumukh B S",
          givenName: "Naaga Sumukh",
          familyName: "B S",
          alternateName: ["Naaga Sumukh", "naagasumukh", "naagasumukh8"],
          jobTitle: "AI/ML Engineer",
          description:
            "AI/ML engineer from Bengaluru, India. Builds intelligent systems using machine learning, NLP, generative AI and automation. Creator of SacchAI (88.4% accuracy browser extension), MediConnect (full-stack HealthcareOS), and JobShield (AI fake-job detector). NMIT B.E. ISE student. Top 0.095% global LinkedIn rank — Cleve AI 2024.",
          url: "https://naagasumukh.engineer",
          email: "naagasumukh1@gmail.com",
          telephone: "+91-99723-71999",
          image: {
            "@type": "ImageObject",
            url: "https://naagasumukh.engineer/og-image.png",
            width: 1200,
            height: 630,
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "Nitte Meenakshi Institute of Technology",
            alternateName: "NMIT",
            url: "https://www.nmit.ac.in",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bengaluru",
              addressCountry: "IN",
            },
          },
          hasCredential: [
            { "@type": "EducationalOccupationalCredential", name: "ML Specialization", credentialCategory: "Certificate", recognizedBy: { "@type": "Organization", name: "Stanford University / Coursera" } },
            { "@type": "EducationalOccupationalCredential", name: "Generative AI Track", credentialCategory: "Credential", recognizedBy: { "@type": "Organization", name: "Credly" } },
          ],
          knowsAbout: [
            "Artificial Intelligence", "Machine Learning", "Natural Language Processing",
            "Generative AI", "Large Language Models", "Python", "Scikit-learn",
            "Pandas", "NumPy", "TF-IDF", "Random Forest", "N8N", "Power BI",
            "Workflow Automation", "Supabase", "React", "TypeScript", "SQL",
          ],
          award: [
            "Top 0.095% Global LinkedIn Rank — Cleve AI LinkedIn Wrapped 2024",
            "3rd Place — Thinkathon, Cloudzilla, NMIT",
            "5 College Cricket Tournament Wins",
          ],
          sameAs: [
            "https://linkedin.com/in/naaga-sumukh-bs",
            "https://github.com/naagasumukh8",
            "https://naagasumukh.engineer",
          ],
        }),
      },
      // ── WebSite schema — enables Google Sitelinks Search Box ──────────────
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://naagasumukh.engineer/#website",
          name: "Naaga Sumukh B S — AI/ML Engineer Portfolio",
          alternateName: "naagasumukh.engineer",
          url: "https://naagasumukh.engineer",
          description: "Personal portfolio of Naaga Sumukh B S, AI/ML engineer from Bengaluru, India.",
          author: { "@type": "Person", "@id": "https://naagasumukh.engineer/#person" },
          inLanguage: "en-IN",
          copyrightYear: 2025,
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: "https://naagasumukh.engineer/?q={search_term_string}" },
            "query-input": "required name=search_term_string",
          },
        }),
      },
      // ── WebPage schema ─────────────────────────────────────────────────────
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": "https://naagasumukh.engineer/#webpage",
          url: "https://naagasumukh.engineer",
          name: "Naaga Sumukh B S | AI/ML Engineer | Bengaluru",
          description: "Portfolio of Naaga Sumukh B S — AI/ML engineer, NMIT Bengaluru. Projects: SacchAI, MediConnect, JobShield. Skills: ML, NLP, Python, GenAI.",
          isPartOf: { "@type": "WebSite", "@id": "https://naagasumukh.engineer/#website" },
          about: { "@type": "Person", "@id": "https://naagasumukh.engineer/#person" },
          datePublished: "2025-01-01",
          dateModified: new Date().toISOString().split("T")[0],
          inLanguage: "en-IN",
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://naagasumukh.engineer" }],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SplashLoader />
      <TopNav />
      <DesktopRecommendation />
      <GlobalPolish />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <PageTransition>
        <Outlet />
      </PageTransition>
    </QueryClientProvider>
  );
}
