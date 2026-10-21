"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getGoal, getProfile, saveGoal } from "@/lib/mock-store";

const timerOptions = [10, 15, 20, 25, 30, 40, 50, 60, 75, 90, 120, 150, 180];

export default function ParentPage() {
  const router = useRouter();
  const [timer, setTimer] = useState(20);

  const goal = getGoal();
  const profile = getProfile();

  useEffect(() => {
    if (!goal) router.replace("/");
  }, [goal, router]);

  if (!goal) return null;
  const current = goal;

  function approve() {
    saveGoal({ ...current, status: "approved", timerMinutes: timer });
    router.push("/parent/done");
  }

  function deny() {
    saveGoal({ ...current, status: "denied" });
    router.push("/parent/done");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
      <header className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="btn btn-ghost btn-sm rounded-full text-base-content/60"
        >
          ← Back
        </button>
        <span className="flex items-center gap-1.5 text-xs font-bold text-base-content/50">
          Parent view
          <span className="rounded-full bg-base-300/70 px-2 py-0.5">demo</span>
        </span>
      </header>

      <section className="mt-8">
        <h1 className="font-display text-2xl font-extrabold leading-tight">
          Review {profile?.name ?? "your child"}&apos;s goal
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Approve it, and choose how long this focus block should last.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-base-300/60 bg-base-200/60 px-3 py-1.5 text-xs text-base-content/60">
          ✉️ Request delivered to{" "}
          <span className="font-extrabold text-base-content">
            {goal.parentContact || "your device"}
          </span>
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
          Today&apos;s portion
        </h2>
        <p className="mt-3 font-display text-lg font-extrabold">
          {goal.subject} · {goal.topic}
        </p>
        {goal.details && (
          <p className="mt-1 text-sm text-base-content/60">{goal.details}</p>
        )}
      </section>

      <section className="mt-5">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
          How long should this block last?
        </h2>
        <p className="mt-1 text-xs text-base-content/40">
          Pick a length that fits the chapter — not too short, not too long.
        </p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {timerOptions.map((m) => (
            <button
              key={m}
              onClick={() => setTimer(m)}
              className={
                timer === m
                  ? "btn btn-primary h-12 rounded-2xl border-transparent font-extrabold"
                  : "btn h-12 rounded-2xl border-base-300/60 bg-base-200/60 font-bold text-base-content/60 hover:bg-base-300"
              }
            >
              {m}m
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-1 flex-col justify-end gap-3">
        <button
          onClick={approve}
          className="btn btn-success h-14 w-full rounded-full border-transparent text-base font-extrabold shadow-[0_8px_30px_rgba(91,191,164,0.3)]"
        >
          Approve · {timer} min
        </button>
        <button
          onClick={deny}
          className="btn btn-ghost h-12 w-full rounded-full border border-base-300/60 font-bold text-base-content/60"
        >
          Deny this goal
        </button>
        <Link
          href="/"
          className="text-center text-xs text-base-content/40 hover:text-base-content/60"
        >
          Back to student view
        </Link>
      </div>
    </div>
  );
}