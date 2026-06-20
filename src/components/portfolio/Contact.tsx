import { useState } from "react";
import { LampContainer } from "@/components/ui/lamp";

import {
  Reveal,
  SectionLabel,
  OrbitingDots,
} from "./PortfolioUtils";

// ============ CONTACT ============
export function Contact() {
  const links = [
    { l: "Email", v: "naagasumukh1@gmail.com", h: "mailto:naagasumukh1@gmail.com", i: "✉" },
    {
      l: "LinkedIn",
      v: "linkedin.com/in/naaga-sumukh-bs",
      h: "https://linkedin.com/in/naaga-sumukh-bs",
      i: "in",
    },
    { l: "GitHub", v: "github.com/naagasumukh8", h: "https://github.com/naagasumukh8", i: "⌥" },
    { l: "Phone", v: "+91 99723 71999", h: "tel:+919972371999", i: "☎" },
  ];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-70">
        <LampContainer className="h-[420px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
        <OrbitingDots />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="07" text="Transmission" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-8 font-display text-5xl font-bold leading-[0.95] text-body md:text-8xl">
            Let's build something <span className="gradient-text">unforgettable</span>.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mb-20 max-w-2xl text-lg text-muted-soft">
            Open to AI/ML roles, freelance automation, and collaborations.
          </p>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div className="grid gap-4 self-start">
            {links.map((it, i) => (
              <Reveal key={it.l} delay={i * 70}>
                <a
                  href={it.h}
                  target={it.h.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-hover
                  className="contact-row glass-row group flex items-center justify-between gap-4 px-6 md:px-8"
                >
                  <div className="flex items-center gap-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] font-mono text-sm text-violet backdrop-blur-md transition-all group-hover:bg-violet group-hover:text-white">
                      {it.i}
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                        {it.l}
                      </div>
                      <div className="truncate font-display text-xl font-bold text-body transition-colors group-hover:text-violet md:text-3xl">
                        {it.v}
                      </div>
                    </div>
                  </div>
                  <span className="glass-pill shrink-0 !py-2 !px-4 !text-[10px]">
                    Open <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="relative rounded-3xl border border-white/15 bg-white/[0.02] p-6 md:p-8 backdrop-blur-md">
              <div className="absolute top-4 right-6 flex gap-1.5 pointer-events-none">
                <span className="h-2 w-2 rounded-full bg-red-500/40" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/40" />
                <span className="h-2 w-2 rounded-full bg-green-500/40" />
              </div>
              <div className="mb-6 font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                [ secure-terminal: message_inbound ]
              </div>

              {status === "sent" ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  style={{ animation: "fadeIn 0.5s ease both" }}
                >
                  <div className="h-14 w-14 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center text-green-400 text-xl mb-4">
                    ✓
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Message Transmitted
                  </h3>
                  <p className="text-sm text-muted-soft max-w-xs">
                    Connection established. I'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      Ident / Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      disabled={status === "sending"}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none rounded-xl px-4 py-3 text-sm transition-all text-white placeholder-white/25 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      Email / Terminal
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      disabled={status === "sending"}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none rounded-xl px-4 py-3 text-sm transition-all text-white placeholder-white/25 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      Transmission content
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="What are we building?"
                      disabled={status === "sending"}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none rounded-xl px-4 py-3 text-sm transition-all text-white placeholder-white/25 resize-none disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="glass-pill justify-center text-xs font-semibold py-3 disabled:opacity-50"
                  >
                    {status === "sending" ? "Transmitting..." : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        <div
          className="mt-20 h-px w-full origin-left bg-gradient-to-r from-white/20 via-white/10 to-transparent"
          style={{ animation: "drawLine 1.5s 0.3s cubic-bezier(0.16,1,0.3,1) backwards" }}
        />
        <footer className="mt-6 flex flex-col items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-soft md:flex-row">
          <span>
            © 2026{" "}
            <span className="mx-1 text-violet" style={{ animation: "dotPulse 2s 0s infinite" }}>
              ·
            </span>{" "}
            Naaga Sumukh B S{" "}
            <span className="mx-1 text-violet" style={{ animation: "dotPulse 2s 0.5s infinite" }}>
              ·
            </span>{" "}
            Bengaluru
          </span>
          <span>Crafted with intent.</span>
          <style>{`
            @keyframes drawLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
            @keyframes dotPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          `}</style>
        </footer>
      </div>
    </section>
  );
}
