import { useRef, useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Linkedin,
  Github,
  Users,
  Briefcase,
  GraduationCap,
  MessageSquare,
  GitBranch,
  Star,
  Zap,
  Trophy,
} from "lucide-react";
import { HeavyGate } from "@/components/HeavyGate";
import { ImageTrail } from "@/components/ui/image-trail";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { HoverButton } from "@/components/ui/hover-button";

import {
  Reveal,
  WavingBalls,
  GlowTile,
  SectionLabel,
} from "./PortfolioUtils";

// ============ ACHIEVEMENTS / SIGNALS PANEL ============
type AchItem = { icon: typeof Trophy; label: string; value: string; sub?: string };
type FeedPost = { title: string; meta: string; body: string; tag?: string; href?: string };

function AchievementPanel({
  open,
  items,
  accent,
}: {
  open: boolean;
  items: AchItem[];
  accent: string;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="grid gap-3 pt-5 sm:grid-cols-2">
          {items.map((it, i) => (
            <div
              key={it.label}
              className="group relative flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
              style={{
                animation: open ? `fade-in 0.5s ${i * 60}ms both` : undefined,
              }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${accent}22`, color: accent }}
              >
                <it.icon size={20} />
              </span>
              <div className="min-w-0">
                <div className="font-display text-xl font-bold leading-none text-body">
                  {it.value}
                </div>
                <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                  {it.label}
                </div>
                {it.sub && <div className="mt-1 truncate text-xs text-muted-soft/80">{it.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneModal({
  open,
  onClose,
  variant,
  accent,
  handle,
  href,
  items,
  posts,
}: {
  open: boolean;
  onClose: () => void;
  variant: "linkedin" | "github";
  accent: string;
  handle: string;
  href: string;
  items: AchItem[];
  posts: FeedPost[];
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center px-4 py-8"
      style={{ animation: "fade-in 0.25s ease-out both" }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <div
        className="relative flex w-[330px] max-w-[92vw] h-[680px] max-h-[88vh] flex-col rounded-[44px] border border-white/15 bg-[#05080F] overflow-hidden"
        style={{
          animation: "phone-pop 0.45s cubic-bezier(0.16,1,0.3,1) both",
          boxShadow: `0 40px 120px -20px ${accent}55, inset 0 0 0 2px rgba(255,255,255,0.06)`,
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-black border border-white/10" />
        <div className="relative z-20 flex shrink-0 items-center justify-between px-7 pt-3 pb-1 text-[10px] font-mono text-white/70">
          <span>9:41</span>
          <span className="opacity-80">●●●●● 5G</span>
        </div>

        <div className="relative z-20 flex shrink-0 items-center justify-between px-5 pt-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: `${accent}22`, color: accent }}
            >
              {variant === "linkedin" ? <Linkedin size={20} /> : <Github size={20} />}
            </span>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                {variant === "linkedin" ? "LinkedIn" : "GitHub"}
              </div>
              <div className="font-display text-sm font-bold text-body">{handle}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted-soft hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          onWheelCapture={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-2 gap-2">
            {items.map((it, i) => (
              <div
                key={it.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                style={{ animation: `fade-in 0.5s ${i * 70}ms both` }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: accent }}>
                    <it.icon size={14} />
                  </span>
                  <span className="font-display text-base font-bold text-body">{it.value}</span>
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-soft truncate">
                  {it.label}
                </div>
              </div>
            ))}
          </div>

          {variant === "github" && (
            <div
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              style={{ animation: "fade-in 0.6s 0.2s both" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                  Contributions · 12mo
                </span>
                <span className="font-mono text-[10px]" style={{ color: accent }}>
                  active
                </span>
              </div>
              <div className="grid grid-cols-[repeat(26,1fr)] gap-[3px]">
                {Array.from({ length: 26 * 7 }).map((_, i) => {
                  const lvl = Math.floor(Math.random() * 5);
                  const bg =
                    lvl === 0
                      ? "rgba(255,255,255,0.05)"
                      : `${accent}${["33", "66", "99", "ff"][lvl - 1]}`;
                  return (
                    <span
                      key={i}
                      className="aspect-square rounded-[2px]"
                      style={{
                        background: bg,
                        animation: `cell-pop 0.45s ${(i % 26) * 18 + Math.floor(i / 26) * 12}ms both`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {posts.map((p, i) => (
            <a
              key={p.title}
              href={p.href ?? href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.07] transition-colors"
              style={{
                animation:
                  variant === "linkedin"
                    ? `feed-slide 0.5s ${300 + i * 110}ms both`
                    : `repo-rise 0.5s ${500 + i * 100}ms both`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {p.tag ?? (variant === "linkedin" ? "Post" : "Repository")}
                </span>
                <span className="font-mono text-[9px] text-muted-soft">{p.meta}</span>
              </div>
              <div className="mt-2 font-display text-sm font-bold text-body leading-snug">
                {p.title}
              </div>
              <div className="mt-1 text-xs text-muted-soft leading-relaxed">{p.body}</div>
            </a>
          ))}

          <div className="h-2" />
        </div>

        <div className="relative z-20 shrink-0 border-t border-white/10 bg-[#05080F]/95 px-4 py-3 backdrop-blur-xl">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full font-mono text-[11px] uppercase tracking-widest text-white transition-transform active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
              boxShadow: `0 10px 30px -10px ${accent}aa, inset 0 1px 0 rgba(255,255,255,0.3)`,
            }}
          >
            Open {variant === "linkedin" ? "LinkedIn" : "GitHub"} ↗
          </a>
        </div>

        <div className="pointer-events-none absolute bottom-1 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-white/30" />
      </div>

      <style>{`
        @keyframes phone-pop {
          from { opacity: 0; transform: translateY(40px) scale(0.92); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes feed-slide {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes repo-rise {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cell-pop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body,
  );
}

export function Achievements() {
  const [open, setOpen] = useState<"linkedin" | "github" | null>(null);
  const [phone, setPhone] = useState<"linkedin" | "github" | null>(null);

  const linkedin: AchItem[] = [
    { icon: Users, label: "Profile", value: "Open", sub: "naaga-sumukh-bs" },
    { icon: Briefcase, label: "Focus", value: "AI / ML", sub: "Agents · automation" },
    { icon: GraduationCap, label: "Studying", value: "NMIT", sub: "Bengaluru" },
    { icon: MessageSquare, label: "DMs", value: "Open", sub: "Always up for a chat" },
  ];
  const github: AchItem[] = [
    { icon: GitBranch, label: "Public Repos", value: "2", sub: "More shipping soon" },
    { icon: Star, label: "Stars", value: "0", sub: "Early days — give one ⭐" },
    { icon: Zap, label: "Building", value: "AI tools", sub: "Agents · pipelines" },
    { icon: Trophy, label: "Joined", value: "Oct '25", sub: "Fresh on GitHub" },
  ];

  const linkedinPosts: FeedPost[] = [
    {
      tag: "Profile",
      title: "Naaga Sumukh B S",
      meta: "AI / ML student",
      body: "Information Science & Engineering undergraduate at NMIT (2023–2027). Strong foundation in Python, SQL, R, and data analysis with hands-on projects and applied AI experience. Open to ML / AI internship roles.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
    {
      tag: "Achievement",
      title: "1M+ impressions · Top 0.095% globally",
      meta: "Cleve AI · 2024",
      body: "Achieved 1M+ impressions on LinkedIn and ranked among the top 0.095% users globally in 2024 according to Cleve AI.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
    {
      tag: "Experience",
      title: "Digital Marketing Intern, LinkedInforHER",
      meta: "2023 – 2024",
      body: "Created and published professional content across digital platforms. Built automated LinkedIn and YouTube content-posting pipelines using AI-driven workflow tools (N8N, Antigravity) to improve reach and engagement.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
    {
      tag: "Connect",
      title: "Open to ML / AI internships",
      meta: "Bengaluru",
      body: "Seeking Machine Learning / AI internship roles. Passionate about building real-world AI solutions, leveraging generative AI tools, and contributing to impactful, data-driven systems.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
  ];

  const githubPosts: FeedPost[] = [
    {
      tag: "Repository · JavaScript",
      title: "Job_Verify_FYP",
      meta: "Public · active",
      body: "Final-year project: AI-assisted job-listing verification. Work in progress — issues and PRs welcome.",
      href: "https://github.com/naagasumukh8/Job_Verify_FYP",
    },
    {
      tag: "Profile README · Python",
      title: "naagasumukh8",
      meta: "Public",
      body: "Profile repository — quick intro and the things I'm currently exploring.",
      href: "https://github.com/naagasumukh8/naagasumukh8",
    },
    {
      tag: "Status",
      title: "More repos shipping soon",
      meta: "Coming up",
      body: "Agent orchestration experiments and N8N pipeline templates are next on the list to open-source.",
      href: "https://github.com/naagasumukh8",
    },
    {
      tag: "Follow",
      title: "Follow along on GitHub",
      meta: "@naagasumukh8",
      body: "Joined Oct 2025 — early days. A ⭐ on Job_Verify_FYP genuinely helps.",
      href: "https://github.com/naagasumukh8",
    },
  ];

  const Card = ({
    id,
    href,
    Icon,
    title,
    handle,
    accent,
    items,
  }: {
    id: "linkedin" | "github";
    href: string;
    Icon: typeof Linkedin;
    title: string;
    handle: string;
    accent: string;
    items: AchItem[];
  }) => {
    const isOpen = open === id;
    return (
      <div
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-sm transition-all hover:border-white/20 md:p-7"
        style={{ boxShadow: isOpen ? `0 30px 80px -20px ${accent}55` : undefined }}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at 50% 0%, ${accent}1f, transparent 60%)`,
          }}
        />
        <button
          type="button"
          data-hover
          onClick={() => setPhone(id)}
          aria-label={`Open ${title} showcase`}
          className="relative z-10 flex w-full items-center justify-between gap-3 text-left md:gap-4"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 transition-transform group-hover:scale-110 md:h-14 md:w-14"
              style={{ background: `${accent}1f`, color: accent }}
            >
              <Icon size={22} className="md:hidden" />
              <Icon size={26} className="hidden md:block" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                {title}
              </div>
              <div className="truncate font-display text-base font-bold text-body md:text-2xl">
                {handle}
              </div>
            </div>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-all group-hover:scale-110 md:h-10 md:w-10"
            style={{ color: accent, borderColor: `${accent}55` }}
          >
            ↗
          </span>
        </button>

        <div className="relative z-10">
          <AchievementPanel open={isOpen} items={items} accent={accent} />
        </div>

        <div className="relative z-10 mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(isOpen ? null : id)}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-soft hover:text-white"
          >
            {isOpen ? "Hide quick stats" : "Show quick stats"}
          </button>
          <HoverButton
            onClick={() => setPhone(id)}
            className="px-5 py-2 text-[11px] uppercase tracking-widest"
            style={{
              ["--circle-start" as never]: accent,
              ["--circle-end" as never]: "#ffffff",
            }}
          >
            Open showcase ↗
          </HoverButton>
        </div>
      </div>
    );
  };

  return (
    <section
      id="achievements"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      <HeavyGate desktopOnly className="pointer-events-none absolute inset-0 opacity-30">
        <DottedSurface />
      </HeavyGate>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="06" text="Signals" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-4 font-display text-4xl font-bold leading-[0.95] text-body sm:text-5xl md:text-7xl">
            Proof, not <span className="gradient-text">promises.</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mb-10 max-w-2xl text-sm text-muted-soft sm:mb-14 sm:text-lg">
            A phone-style showcase of featured posts, achievements and live signals from across the
            web.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Reveal delay={250}>
            <Card
              id="linkedin"
              href="https://linkedin.com/in/naaga-sumukh-bs"
              Icon={Linkedin}
              title="LinkedIn"
              handle="@naaga-sumukh-bs"
              accent="#0A66C2"
              items={linkedin}
            />
          </Reveal>
          <Reveal delay={350}>
            <Card
              id="github"
              href="https://github.com/naagasumukh8"
              Icon={Github}
              title="GitHub"
              handle="@naagasumukh8"
              accent="#a78bfa"
              items={github}
            />
          </Reveal>
        </div>
      </div>

      <PhoneModal
        open={phone === "linkedin"}
        onClose={() => setPhone(null)}
        variant="linkedin"
        accent="#0A66C2"
        handle="@naaga-sumukh-bs"
        href="https://linkedin.com/in/naaga-sumukh-bs"
        items={linkedin}
        posts={linkedinPosts}
      />
      <PhoneModal
        open={phone === "github"}
        onClose={() => setPhone(null)}
        variant="github"
        accent="#a78bfa"
        handle="@naagasumukh8"
        href="https://github.com/naagasumukh8"
        items={github}
        posts={githubPosts}
      />
    </section>
  );
}

// ============ VIBE ============
export function Vibe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokens = ["AI", "ML", "Py", "GenAI", "NLP", "N8N", "React", "SQL", "Auto", "✦", "◉", "→"];
  return (
    <section
      ref={containerRef}
      id="vibe"
      className="relative h-[80vh] w-full overflow-hidden border-y border-white/[0.04]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3a] via-[#0F2540] to-black" />
      <WavingBalls
        count={
          typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? 5 : 16
        }
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <HeavyGate desktopOnly className="pointer-events-none absolute inset-0">
        <ImageTrail
          containerRef={containerRef as React.RefObject<HTMLElement>}
          interval={70}
          rotationRange={25}
        >
          {tokens.map((t, i) => (
            <div
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-violet/40 bg-black/60 font-mono text-xs uppercase tracking-widest text-body backdrop-blur-md shadow-[0_0_30px_rgba(124,110,255,0.5)]"
            >
              {t}
            </div>
          ))}
        </ImageTrail>
      </HeavyGate>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
            [ INTERLUDE — MOVE YOUR CURSOR ]
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2
            className="font-display font-bold leading-[0.9] text-body"
            style={{ fontSize: "clamp(48px, 10vw, 140px)" }}
          >
            Made <span className="gradient-text">to move.</span>
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-xl font-mono text-[11px] uppercase tracking-[0.25em] text-muted-soft">
            Every pixel here breathes — same energy I bring to systems.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
