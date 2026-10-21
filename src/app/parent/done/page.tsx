"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Lamp from "@/components/Lamp";
import { getGoal } from "@/lib/mock-store";

export default function ParentDonePage() {
  const router = useRouter();
  const [goal, setGoal] = useState(getGoal());

  useEffect(() => {
    if (!getGoal()) router.replace("/");
  }, [router]);

  if (!goal) return null;
  const approved = goal.status === "approved";

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
      <header className="flex items-center justify-between">
        <span className="font-display text-sm font-extrabold tracking-tight">
          Focus<span className="text-primary">Glow</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs font-bold text-base-content/50">
          Parent view
          <span className="rounded-full bg-base-300/70 px-2 py-0.5">demo</span>
        </span>
      </header>

      <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-base-300/60 bg-base-200/60 px-6 pt-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(91,191,164,0.12),transparent_70%)]" />
        <div className="relative mx-auto w-48">
          <Lamp state={approved ? "passed" : "failed"} />
        </div>
        <div className="pb-5 text-center">
          <span
            className={
              approved
                ? "badge border-transparent bg-secondary/15 py-3 text-xs font-bold text-secondary"
                : "badge border-transparent bg-accent/15 py-3 text-xs font-bold text-accent"
            }
          >
            {approved ? "Approved ✓" : "Denied"}
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-base-300/60 bg-base-200/40 p-5 text-center">
        {approved ? (
          <>
            <h1 className="font-display text-xl font-extrabold">
              Green light is on
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-base-content/60">
              {goal.subject} · {goal.topic} is locked in for{" "}
              <span className="font-extrabold text-base-content">
                {goal.timerMinutes} minutes
              </span>
              . Your child can dock and start whenever they&apos;re ready.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-xl font-extrabold">
              This goal was denied
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-base-content/60">
              Ask your child to set a more specific or reasonable goal, and
              we&apos;ll review the next one.
            </p>
          </>
        )}
      </section>

      <div className="mt-8 flex flex-1 flex-col justify-end gap-3">
        {approved ? (
          <Link
            href="/focus"
            className="btn btn-primary h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
          >
            Dock Your Phone &amp; Start
          </Link>
        ) : (
          <Link
            href="/goal"
            className="btn btn-primary h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
          >
            Set a New Goal
          </Link>
        )}
        <Link
          href="/dashboard"
          className="btn btn-ghost h-12 w-full rounded-full border border-base-300/60 font-bold text-base-content/60"
        >
          View Parent Report
        </Link>
      </div>
    </div>
  );
}