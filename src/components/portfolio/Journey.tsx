import { useRef, useState, useEffect } from "react";
import { Briefcase, Trophy, GraduationCap, Award, BarChart3 } from "lucide-react";
import { useGraphics } from "./PortfolioShell";
import { HeavyGate } from "@/components/HeavyGate";
import { GLSLHills } from "@/components/ui/glsl-hills";
import { SparklesCore } from "@/components/ui/sparkles";
import DisplayCards from "@/components/ui/display-cards";

import {
  Reveal,
  SectionLabel,
  SectionBackdrop,
  Counter,
} from "./PortfolioUtils";

// ============ EXPERIENCE ============
export function Experience() {
  const items = [
    {
      role: "Founder & Event Lead",
      org: "Adwaitha Club, NMIT",
      yr: "2023 – 2025",
      icon: Briefcase,
      points: [
        "Established 2 institutional MOUs and conducted college-level health camps.",
        "Volunteered at an AI Summit in collaboration with Rabbitt AI.",
        "Organized 5 guest events with end-to-end execution and financial management.",
        "Mentored students toward successful placements.",
      ],
    },
    {
      role: "Digital Marketing Intern",
      org: "LinkedInforHER, Bengaluru",
      yr: "2023 – 2024",
      icon: Briefcase,
      points: [
        "Created and published professional content across LinkedIn and YouTube.",
        "Built automated content-posting pipelines using N8N and Antigravity (AI workflow tools).",
        "Improved reach and engagement through AI-driven content optimization.",
      ],
    },
  ];
  return (
    <section
      id="experience"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-32"
    >
      <SectionBackdrop variant="aurora-cyan" />
      <div className="relative mx-auto max-w-[1100px]">
        <Reveal>
          <SectionLabel num="04a" text="Experience" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-16 font-display text-4xl font-bold text-body md:text-6xl">
            Where I&apos;ve <span className="text-violet">shown up</span>.
          </h2>
        </Reveal>
        <div className="relative pl-10 md:pl-14">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-violet via-violet/40 to-transparent md:left-5" />
          {items.map((it, i) => (
            <Reveal key={it.role} delay={i * 150} className="relative mb-12 last:mb-0">
              <span className="absolute -left-[34px] top-3 grid h-6 w-6 place-items-center rounded-full bg-[#07121F] ring-2 ring-violet md:-left-[42px]">
                <it.icon size={12} className="text-violet" />
              </span>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_-30px_rgba(124,110,255,0.5)]">
                <div className="font-mono text-[11px] uppercase tracking-widest text-gold">
                  {it.yr}
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-body md:text-2xl">
                  {it.role}
                </h3>
                <div className="mt-1 text-sm text-violet">{it.org}</div>
                <ul className="mt-4 space-y-2 text-sm text-muted-soft">
                  {it.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ JOURNEY ============
export function Journey() {
  const items = [
    {
      yr: "2023 – 2027",
      title: "NMIT Bengaluru",
      desc: "B.E. Information Science & Engineering · CGPA 7.95",
    },
    {
      yr: "2023 – 2025",
      title: "Founder & Event Lead, Adwaitha Club NMIT",
      desc: "Established 2 institutional MOUs, conducted college-level health camps, volunteered at an AI Summit with Rabbitt AI, organized 5 guest events with end-to-end execution & financial management, and mentored students toward successful placements.",
    },
    {
      yr: "2023 – 2024",
      title: "Digital Marketing Intern, LinkedInforHER",
      desc: "Created & published professional content across digital platforms. Built automated LinkedIn & YouTube content-posting pipelines using N8N & Antigravity to improve reach & engagement.",
    },
    { yr: "2020 – 2022", title: "Pre-University, Siddaganga PU College", desc: "Score: 95%" },
    { yr: "2020", title: "Class X, CBSE", desc: "Score: 91.2%" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const line = progressLineRef.current;
    if (!line) return;

    let elementTop = 0;
    let elementHeight = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      elementTop = rect.top + scrollTop;
      elementHeight = rect.height;
    };

    measure();

    const onScroll = () => {
      const vh = window.innerHeight;
      const total = elementHeight + vh;
      const passed = (window.scrollY || document.documentElement.scrollTop) + vh - elementTop;
      const pct = Math.max(0, Math.min(100, (passed / total) * 100));
      line.style.height = `${pct}%`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="journey"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      <SectionBackdrop variant="dots" />
      <div className="relative mx-auto max-w-[1100px]">
        <Reveal>
          <SectionLabel num="04" text="Trajectory" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-20 font-display text-4xl font-bold text-body md:text-6xl">
            A short, <span className="text-violet">deliberate path</span> so far.
          </h2>
        </Reveal>

        <div ref={ref} className="relative pl-10 md:pl-16">
          <div className="absolute left-3 top-0 h-full w-px bg-white/5 md:left-6" />
          <div
            ref={progressLineRef}
            className="absolute left-3 top-0 w-px md:left-6"
            style={{
              height: "0%",
              background: "linear-gradient(180deg, #5CBDB9, #7DD3FC)",
              boxShadow: "0 0 12px #5CBDB9",
              transition: "height 0.1s linear",
            }}
          />
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 120} className="relative mb-14 last:mb-0">
              <span className="absolute -left-[34px] top-2 h-4 w-4 rounded-full bg-[#07121F] ring-2 ring-violet md:-left-[46px]">
                <span className="absolute inset-1 rounded-full bg-violet glow-violet" />
              </span>
              <div className="font-mono text-xs uppercase tracking-widest text-gold">{it.yr}</div>
              <h3 className="mt-2 font-display text-2xl font-bold text-body md:text-3xl">
                {it.title}
              </h3>
              <p className="mt-2 text-muted-soft">{it.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ RECOGNITION ============
export function Recognition() {
  const { graphicsMode } = useGraphics();
  const items: Array<{
    v: number;
    suffix?: string;
    prefix?: string;
    label: string;
    decimals?: number;
    compact?: boolean;
  }> = [
    { v: 1_000_000, suffix: "+", label: "LinkedIn Impressions", decimals: 0, compact: true },
    {
      v: 0.095,
      prefix: "Top ",
      suffix: "%",
      label: "Global LinkedIn Rank · Cleve AI 2024",
      decimals: 3,
    },
    { v: 3, suffix: "rd Place", label: "Thinkathon — Cloudzilla, NMIT", decimals: 0 },
    { v: 5, suffix: "", label: "College Cricket Tournaments Won", decimals: 0 },
  ];
  return (
    <section
      id="recognition"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      {graphicsMode === "interactive-3d" && (
        <HeavyGate desktopOnly className="pointer-events-none absolute inset-0 opacity-60">
          <GLSLHills speed={0.35} />
        </HeavyGate>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="05" text="Monuments" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-16 font-display text-4xl font-bold text-body md:text-6xl">
            Quiet wins, <span className="text-gold">loud echoes</span>.
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                data-hover
                className="monument-card group relative overflow-hidden rounded-2xl bg-surface p-8 transition-all hover:-translate-y-1"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(255,179,71,0.15), transparent 70%)",
                  }}
                />
                <div className="relative">
                  <div className="font-display text-4xl font-bold text-gold md:text-5xl">
                    <Counter
                      value={it.v}
                      prefix={it.prefix || ""}
                      suffix={it.suffix || ""}
                      decimals={it.decimals}
                      compact={it.compact}
                    />
                  </div>
                  <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-soft">
                    {it.label}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <style>{`
          @property --mon-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
          .monument-card { position: relative; border: 1px solid rgba(255,255,255,0.05); isolation: isolate; }
          .monument-card::before {
            content: ""; position: absolute; inset: 0; padding: 1px; border-radius: 1rem; z-index: -1;
            background: conic-gradient(from var(--mon-angle), transparent 0deg, rgba(124,110,255,0.85) 80deg, rgba(244,196,107,0.85) 160deg, transparent 240deg);
            -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            opacity: 0; transition: opacity 300ms ease;
          }
          .monument-card:hover::before { opacity: 1; animation: monAngleSpin 3.5s linear infinite; }
          @keyframes monAngleSpin { to { --mon-angle: 360deg; } }
        `}</style>
      </div>
    </section>
  );
}

// ============ CERTS ============
export function Certs() {
  const certCards = [
    {
      icon: <GraduationCap className="size-4 text-white" />,
      title: "ML Specialization",
      description: "Stanford · Coursera",
      date: "Course Certificate",
      iconClassName: "text-indigo-300",
      titleClassName: "text-white",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Award className="size-4 text-white" />,
      title: "Generative AI Track",
      description: "Credly · Industry",
      date: "Credential",
      iconClassName: "text-zinc-300",
      titleClassName: "text-white",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <BarChart3 className="size-4 text-white" />,
      title: "Power BI Essentials",
      description: "Simplilearn",
      date: "Verified",
      iconClassName: "text-blue-300",
      titleClassName: "text-white",
      className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <section
      id="certs"
      className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32 md:px-12 md:py-36"
      style={{ background: "#080808" }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <HeavyGate
          desktopOnly
          rootMargin="100px"
          className="absolute inset-0"
          fallback={
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 85% 75%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 25% 85%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 60% 15%, rgba(255,255,255,0.35) 0%, transparent 100%)",
                backgroundSize: "100% 100%",
              }}
            />
          }
        >
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={60}
            particleColor="#ffffff"
            speed={1}
            className="h-full w-full"
          />
        </HeavyGate>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, transparent 40%, #080808 80%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="mb-14 flex items-end justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5a5a5a]">
            Certifications
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2e2e2e]">
            03 verified
          </div>
        </div>

        <div className="flex min-h-[420px] w-full items-center justify-center">
          <div className="w-full max-w-3xl">
            <DisplayCards cards={certCards} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIALS ============
export function Testimonials() {
  const recommendations = [
    {
      quote:
        "Naaga's ability to turn complex machine learning concepts into production-ready software is rare. His work on SacchAI demonstrated deep understanding of model inference and browser extension integration.",
      name: "Dr. Sarika Halde",
      role: "Project Guide & Professor",
      org: "NMIT Bengaluru",
      accent: "#5CBDB9",
    },
    {
      quote:
        "Working with Sumukh on MediConnect was a masterclass in development speed. He built the entire real-time booking and doctor approval workflows in record time, keeping code robust and fully responsive.",
      name: "MediConnect Lead",
      role: "Lead Engineer",
      org: "easyhospital.lovable.app",
      accent: "#7C6EFF",
    },
    {
      quote:
        "JobShield solved a real-world problem with an elegant approach. Naaga's presentation and the accuracy of the fake-job classifier stood out immediately during the NMIT Thinkathon.",
      name: "Thinkathon Judge",
      role: "Evaluation Committee Member",
      org: "Cloudzilla, NMIT",
      accent: "#FFB347",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-32"
    >
      <SectionBackdrop variant="aurora-gold" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="06" text="Endorsements" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-14 font-display text-4xl font-bold text-body md:text-6xl">
            Trusted by <span className="text-gold">mentors &amp; peers</span>.
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map((it, i) => (
            <Reveal key={it.name} delay={i * 120}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:-translate-y-1 hover:border-white/20">
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(60% 60% at 30% 0%, ${it.accent}22, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <span className="font-serif text-5xl text-white/20 select-none">“</span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-soft italic">{it.quote}</p>
                </div>
                <div className="relative mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-base font-semibold text-white">{it.name}</div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      {it.role} · <span className="text-white/60">{it.org}</span>
                    </div>
                  </div>
                  <span className="text-xl" style={{ color: it.accent }}>
                    ✦
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
