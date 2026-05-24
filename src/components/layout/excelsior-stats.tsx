"use client";

import { useEffect, useState } from "react";
import { BookOpen, Tag, Users } from "lucide-react";

interface Stats {
  totalCategories: number;
  totalPrompts: number;
  totalUsers: number;
}

function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export function ExcelsiorStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: Stats) => setStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      icon: Tag,
      label: "Categories",
      value: stats?.totalCategories ?? null,
      description: "Organised by how business works",
    },
    {
      icon: BookOpen,
      label: "Prompts",
      value: stats?.totalPrompts ?? null,
      description: "Battle-tested and ready to use",
    },
    {
      icon: Users,
      label: "Members",
      value: stats?.totalUsers ?? null,
      description: "Professionals using the library",
    },
  ];

  return (
    <section className="py-14 border-b bg-muted/20">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map(({ icon: Icon, label, value, description }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl border bg-background/80 shadow-sm text-center"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold tracking-tight">
                {value === null ? (
                  <span className="opacity-30">—</span>
                ) : (
                  <AnimatedCount target={value} />
                )}
              </p>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
