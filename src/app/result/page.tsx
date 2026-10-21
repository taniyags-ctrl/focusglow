"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Lamp from "@/components/Lamp";
import { getSession } from "@/lib/mock-store";

const confettiColors = ["#ffb24c", "#5bbfa4", "#7cb8e8", "#f5b3ad", "#fff6e8"];

function Confetti() {
  const pieces = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${2.2 + Math.random() * 1.8}s`,
            animationDelay: `${Math.random() * 0.9}s`,
            backgroundColor: confettiColors[i % confettiColors.length],
          }}
        />
      ))}
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    if (!getSession()) router.replace("/");
  }, [router]);

  if (!session) return null;
  const passed = session.status === "passed";

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
      {passed && <Confetti />}

      <header className="flex items-center justify-between">
        <span className="font-display text-sm font-extrabold tracking-tight">
          Focus<span className="text-primary">Glow</span>
        </span>
        <span
          className={
            passed
              ? "badge border-transparent bg-secondary/15 py-2.5 text-xs font-bold text-secondary"
              : "badge border-transparent bg-accent/15 py-2.5 text-xs font-bold text-accent"
          }
        >
          {passed ? "Session passed" : "Session failed"}
        </span>
      </header>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-base-300/60 bg-base-200/60 px-6 pt-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,178,76,0.14),transparent_70%)]" />
        <div className="relative mx-auto w-52">
          <Lamp state={passed ? "passed" : "failed"} />
        </div>
      </section>

      <section className="mt-6 text-center">
        <h1 className="font-display text-2xl font-extrabold leading-tight">
          {passed ? "Focus block complete!" : "Focus block failed"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-base-content/60">
          {passed ? (
            <>
              {session.subject} · {session.topic} — nicely done. Your apps are
              unlocked and your reward is released.
            </>
          ) : (
            <>
              {session.subject} · {session.topic} didn&apos;t pass this time.
              No credits were earned. Set a new goal and try again — you&apos;ve
              got this.
            </>
          )}
        </p>
      </section>

      <section className="mt-5 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-base-content/70">Reward</span>
          <span
            className={
              passed
                ? "font-display text-2xl font-black text-secondary"
                : "font-display text-2xl font-black text-base-content/30"
            }
          >
            {passed ? `+${session.credits} ⭐` : "0 ⭐"}
          </span>
        </div>
        <div className="mt-3 h-px w-full bg-base-300/60" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-base-content/70">
            Your parent&apos;s log
          </span>
          <span className="text-sm text-base-content/60">
            {passed ? "Summary sent ✓" : "Failure recorded"}
          </span>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
          Memory check review
        </h2>
        <ul className="mt-3 space-y-2.5">
          {[
            { label: "Questions answered", ok: true },
            { label: "Passed the check (2 of 3)", ok: passed },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-base-content/70">{item.label}</span>
              <span
                className={
                  item.ok ? "font-extrabold text-secondary" : "font-extrabold text-accent"
                }
              >
                {item.ok ? "✓" : "✕"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-1 flex-col justify-end gap-3">
        <Link
          href="/dashboard"
          className="btn btn-primary h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
        >
          View Parent Report
        </Link>
        <Link
          href="/"
          className="btn btn-ghost h-12 w-full rounded-full border border-base-300/60 font-bold text-base-content/60"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}