"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Briefcase, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── CSS injected once ──────────────────────────────────────────────────── */
const CSS = `
@keyframes aurora1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(6%,-8%) scale(1.08); }
  66%      { transform: translate(-4%, 5%) scale(0.96); }
}
@keyframes aurora2 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(-7%, 6%) scale(1.06); }
  70%      { transform: translate(5%,-4%) scale(0.94); }
}
@keyframes aurora3 {
  0%,100% { transform: translate(0,0) scale(1); }
  25%      { transform: translate(8%, 4%) scale(1.05); }
  75%      { transform: translate(-5%,-6%) scale(0.97); }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(28px); filter:blur(6px); }
  to   { opacity:1; transform:translateY(0);    filter:blur(0); }
}
@keyframes scalePop {
  from { opacity:0; transform:scale(0.88); }
  to   { opacity:1; transform:scale(1); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

.exc-fade-up   { animation: fadeUp  0.7s cubic-bezier(.22,1,.36,1) both; }
.exc-scale-pop { animation: scalePop 0.5s cubic-bezier(.22,1,.36,1) both; }

.exc-reveal {
  opacity:0;
  transform:translateY(32px);
  filter:blur(4px);
  transition: opacity 0.7s cubic-bezier(.22,1,.36,1),
              transform 0.7s cubic-bezier(.22,1,.36,1),
              filter 0.7s cubic-bezier(.22,1,.36,1);
}
.exc-reveal.visible {
  opacity:1; transform:translateY(0); filter:blur(0);
}

.exc-card {
  transition: transform 0.4s cubic-bezier(.22,1,.36,1),
              box-shadow 0.4s cubic-bezier(.22,1,.36,1),
              border-color 0.3s ease;
}
.exc-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 60px -10px rgba(124,58,237,.18);
  border-color: rgba(124,58,237,.35);
}

.exc-shimmer-btn {
  background: linear-gradient(90deg,
    #7c3aed 0%, #a855f7 40%, #7c3aed 60%, #6d28d9 100%);
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
}

.exc-glass {
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
}
`;

/* ─── Aurora orb component ───────────────────────────────────────────────── */
function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full opacity-30 dark:opacity-20"
        style={{
          width: "60vw", height: "60vw",
          top: "-20%", left: "-10%",
          background: "radial-gradient(circle, #7c3aed 0%, #a855f7 40%, transparent 70%)",
          animation: "aurora1 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-20 dark:opacity-15"
        style={{
          width: "50vw", height: "50vw",
          top: "10%", right: "-15%",
          background: "radial-gradient(circle, #6d28d9 0%, #8b5cf6 50%, transparent 70%)",
          animation: "aurora2 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-20 dark:opacity-10"
        style={{
          width: "40vw", height: "40vw",
          bottom: "-10%", left: "30%",
          background: "radial-gradient(circle, #4f46e5 0%, #7c3aed 50%, transparent 70%)",
          animation: "aurora3 26s ease-in-out infinite",
        }}
      />
      {/* Fine noise/grain overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
interface HeroProps {
  brandName: string;
  description: string;
  showRegister: boolean;
  isOAuth: boolean;
}

export function ExcelsiorHero({ brandName, description, showRegister, isOAuth }: HeroProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="relative flex items-center min-h-[88vh] overflow-hidden">
        <AuroraBackground />
        {/* Soft gradient floor to blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <div className="container relative z-10 py-24">
          <div className="max-w-2xl">
            {/* Floating badge */}
            <div className="exc-scale-pop mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full exc-glass border border-primary/25 text-xs font-semibold text-primary shadow-lg shadow-primary/10" style={{ animationDelay: "0ms" }}>
              <Sparkles className="h-3.5 w-3.5" />
              Battle-tested Business Prompts
            </div>

            {/* Headline */}
            <h1
              className="exc-fade-up text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
              style={{ animationDelay: "80ms" }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {brandName}
              </span>
            </h1>

            {/* Description */}
            <p
              className="exc-fade-up mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl"
              style={{ animationDelay: "180ms" }}
            >
              {description}
            </p>

            {/* Check items */}
            <div
              className="exc-fade-up mt-7 flex flex-col gap-2.5"
              style={{ animationDelay: "280ms" }}
            >
              {[
                "Free to browse — no account required",
                "Works with ChatGPT, Claude, Gemini and more",
                "Organised by business category",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="exc-fade-up mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: "380ms" }}
            >
              <Button size="lg" className="exc-shimmer-btn text-white border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" asChild>
                <Link href="/prompts">
                  Browse Library
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {showRegister && (
                <Button
                  size="lg"
                  variant="outline"
                  className="exc-glass border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  asChild
                >
                  <Link href={isOAuth ? "/login" : "/register"}>
                    {isOAuth ? "Sign In" : "Create Free Account"}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Scroll-reveal feature cards ────────────────────────────────────────── */
export function ExcelsiorFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(".exc-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Expert-Curated",
      description:
        "Every prompt is tested and refined for real business use — no filler, no fluff, just results you can copy and deploy immediately.",
      delay: 0,
    },
    {
      icon: Zap,
      title: "Deploy in Seconds",
      description:
        "One click copies to your clipboard. Paste straight into ChatGPT, Claude, Gemini, or any AI tool and get results immediately.",
      delay: 120,
    },
    {
      icon: Briefcase,
      title: "Built for Business",
      description:
        "From strategy to HR to finance — prompts organised around how your business actually works, not generic categories.",
      delay: 240,
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 border-b">
      <div className="container">
        {/* Section header */}
        <div
          className="exc-reveal text-center mb-14"
          style={{ transitionDelay: "0ms" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/8 text-primary border border-primary/15 mb-4">
            <Sparkles className="h-3 w-3" />
            Why Excelsior Prompt Library
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to get more done with AI
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Organised, tested, and ready to deploy — built for serious business professionals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description, delay }) => (
            <div
              key={title}
              className="exc-reveal exc-card flex flex-col gap-4 p-7 rounded-2xl border bg-card/50 exc-glass"
              style={{ transitionDelay: `${delay}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner shadow-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Register CTA (scroll-reveal) ──────────────────────────────────────── */
export function ExcelsiorRegisterCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(".exc-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) (entry.target as HTMLElement).classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20">
      <div className="container">
        <div className="exc-reveal relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-10 md:p-14">
          {/* Aurora inside CTA */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                <Sparkles className="h-3 w-3" />
                Free Forever
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to work smarter with AI?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Create a free account to save prompts, build your personal library, and get full access.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {[
                  "Save and pin your favourite prompts",
                  "Contribute your own prompt templates",
                  "Unlimited access — use as many as you like",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <Button size="lg" className="exc-shimmer-btn text-white border-0 shadow-lg shadow-primary/25" asChild>
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="exc-glass border-primary/20 hover:border-primary/40" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
