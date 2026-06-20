import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
// hamburger icon is rendered inline as three animated bars
import portrait from "../assets/portrait-avatar.jpg.asset.json";

const links = [
  { hash: "", label: "Home", id: "hero" },
  { hash: "about", label: "About", id: "about" },
  { hash: "work", label: "Work", id: "work" },
  { hash: "journey", label: "Journey", id: "journey" },
  { hash: "vibe", label: "Vibe", id: "vibe" },
  { hash: "contact", label: "Contact", id: "contact" },
] as const;

export function TopNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = links.map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const isActive = (id: string) => active === id;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "[backdrop-filter:blur(16px)_saturate(140%)] bg-background/55 border-b border-white/[0.08]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/40 shadow-lg shadow-primary/20 active:scale-[0.94] transition-transform duration-200">
            <img src={portrait.url} alt="Naaga Sumukh" className="h-full w-full object-cover" />
          </span>
          <span className="hidden sm:inline font-mono text-[12px] font-bold tracking-[0.18em] text-foreground">
            NAAGA&nbsp;SUMUKH
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-md">
          {links.map((l) => {
            const act = isActive(l.id);
            return (
              <li key={l.label}>
                <a
                  href={l.hash ? `/#${l.hash}` : "/"}
                  onClick={(e) => smoothScrollOnSamePage(e, l.hash)}
                  aria-current={act ? "page" : undefined}
                  className={`relative inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    act
                      ? "text-white shadow-[0_0_22px_rgba(124,110,255,0.65)] ring-1 ring-[rgba(167,139,250,0.7)]"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/10"
                  }`}
                  style={
                    act
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(124,110,255,0.35), rgba(255,255,255,0.06))",
                        }
                      : undefined
                  }
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground [backdrop-filter:blur(10px)]"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-current transition-transform duration-300"
              style={{ transform: open ? "translateY(6px) rotate(45deg)" : "translateY(0) rotate(0)" }}
            />
            <span
              className="absolute left-0 top-[6px] h-[2px] w-full rounded-full bg-current transition-opacity duration-200"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="absolute left-0 top-[12px] h-[2px] w-full rounded-full bg-current transition-transform duration-300"
              style={{ transform: open ? "translateY(-6px) rotate(-45deg)" : "translateY(0) rotate(0)" }}
            />
          </span>
        </button>
      </nav>

      <div
        className={`md:hidden fixed inset-x-0 top-[60px] bottom-0 z-40 transition-[clip-path] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          clipPath: open
            ? "circle(160% at calc(100% - 28px) 0%)"
            : "circle(0% at calc(100% - 28px) 0%)",
          background:
            "linear-gradient(180deg, rgba(7,18,31,0.96) 0%, rgba(7,18,31,0.92) 100%)",
          backdropFilter: "blur(20px) saturate(140%)",
        }}
      >
        <ul className="mx-4 mt-4 flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          {links.map((l, idx) => {
            const act = isActive(l.id);
            return (
              <li
                key={l.label}
                style={{
                  transform: open ? "translateX(0)" : "translateX(40px)",
                  opacity: open ? 1 : 0,
                  transition: `transform 480ms cubic-bezier(0.16,1,0.3,1) ${open ? 120 + idx * 70 : 0}ms, opacity 320ms ease ${open ? 120 + idx * 70 : 0}ms`,
                }}
              >
                <a
                  href={l.hash ? `/#${l.hash}` : "/"}
                  onClick={(e) => {
                    setOpen(false);
                    smoothScrollOnSamePage(e, l.hash);
                  }}
                  aria-current={act ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors active:scale-[0.96] ${
                    act
                      ? "text-white bg-[linear-gradient(135deg,rgba(124,110,255,0.35),rgba(255,255,255,0.06))] shadow-[0_0_22px_rgba(124,110,255,0.55)] ring-1 ring-[rgba(167,139,250,0.7)]"
                      : "text-foreground/85 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

function smoothScrollOnSamePage(e: React.MouseEvent, hash: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/") return;
  e.preventDefault();
  if (!hash) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "/");
    return;
  }
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `/#${hash}`);
  }
}

void Link;
void useRouterState;
