"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Lamp from "@/components/Lamp";
import { getGoal } from "@/lib/mock-store";

const PING_WAIT_SECONDS = 300;

export default function WaitingPage() {
  const router = useRouter();
  const [remaining, setRemaining] = useState(PING_WAIT_SECONDS);

  useEffect(() => {
    const goal = getGoal();
    if (!goal || goal.status !== "waiting") router.replace("/");
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [router]);

  const goal = getGoal();
  const mins = Math.floor(remaining / 60);
  const secs = String(remaining % 60).padStart(2, "0");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
      <header className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="btn btn-ghost btn-sm rounded-full text-base-content/60"
        >
          ← Back
        </button>
        <span className="font-display text-sm font-extrabold tracking-tight">
          Focus<span className="text-primary">Glow</span>
        </span>
      </header>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-base-300/60 bg-base-200/60 px-6 pt-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,178,76,0.14),transparent_70%)]" />
        <div className="relative mx-auto w-48">
          <Lamp state="idle" />
        </div>
        <div className="pb-5 text-center">
          <span className="badge badge-ghost gap-1.5 border-base-300/60 py-3 text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_rgba(255,178,76,0.9)]" />
            Waiting for parent approval
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
          Your goal
        </h2>
        {goal ? (
          <div className="mt-3 space-y-1">
            <p className="font-display text-lg font-extrabold">
              {goal.subject} · {goal.topic}
            </p>
            {goal.details && (
              <p className="text-sm text-base-content/60">{goal.details}</p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-base-content/60">Loading…</p>
        )}
      </section>

      <section className="mt-5 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
        <p className="text-sm leading-relaxed text-base-content/70">
          A notification has been sent to{" "}
          <span className="font-extrabold text-base-content">
            {goal?.parentContact || "your parent"}
          </span>
          . They&apos;ll choose how long this block should last and approve it
          from their own phone — you don&apos;t hand over yours.
        </p>
      </section>

      <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
        <button
          disabled={remaining > 0}
          className="btn btn-ghost h-12 w-full rounded-full border border-base-300/60 font-bold disabled:opacity-60"
        >
          {remaining > 0
            ? `Ping parent again in ${mins}:${secs}`
            : "Ping parent again"}
        </button>
        <Link
          href="/parent"
          className="btn btn-primary h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
        >
          Demo: preview the parent&apos;s phone
        </Link>
        <p className="text-center text-xs text-base-content/40">
          In the real product this arrives on the parent&apos;s own device.
        </p>
      </div>
    </div>
  );
}