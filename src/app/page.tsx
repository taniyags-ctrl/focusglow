"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lamp, { type LampState } from "@/components/Lamp";
import {
  getProfile,
  getGoal,
  getCredits,
  type StudentProfile,
  type Goal,
} from "@/lib/mock-store";

export default function Home() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!sessionStorage.getItem("focusglow_cleared")) {
      localStorage.clear();
      sessionStorage.setItem("focusglow_cleared", "1");
    }
    setProfile(getProfile());
    setGoal(getGoal());
    setCredits(getCredits());
  }, []);

  const lamp: LampState =
    goal?.status === "approved"
      ? "passed"
      : goal?.status === "denied"
      ? "failed"
      : "idle";

  const firstName = profile?.name?.split(" ")[0];

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15">
            <span className="h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_12px_rgba(255,178,76,0.9)]" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Focus<span className="text-primary">Glow</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-success gap-1 border-transparent bg-secondary/15 px-3 py-2.5 text-secondary-content">
            ★ {credits}
          </span>
          <Link
            href="/dashboard"
            className="btn btn-ghost btn-sm rounded-full border border-base-300/60 px-3 text-xs font-bold text-base-content/60"
          >
            Parent
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10">
        <section className="text-center">
          <h1 className="font-display text-2xl font-extrabold leading-tight">
            {firstName ? `Good evening, ${firstName}` : "Welcome!"}
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            {profile
              ? "Ready to protect your focus for a little while?"
              : "Let's set up your profile so we know who's studying."}
          </p>
        </section>

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-base-300/60 bg-base-200/60 px-6 pt-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,178,76,0.12),transparent_70%)]" />
          <div className="relative flex items-end justify-center gap-4 px-2">
            <div className="w-44 sm:w-52">
              <Lamp state={lamp} />
            </div>
            {goal ? (
              <div className="mb-1 w-32 -rotate-3 rounded-xl bg-cream p-3 text-midnight shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                <p className="text-[9px] font-black uppercase tracking-widest text-midnight/40">
                  Today
                </p>
                <p className="mt-0.5 text-[11px] font-extrabold leading-tight">
                  {goal.subject} · {goal.topic}
                </p>
                <p className="mt-1 text-[9px] font-bold text-midnight/50">
                  {goal.status === "approved"
                    ? `✔ ${goal.timerMinutes} min`
                    : goal.status === "waiting"
                    ? "⏳ review…"
                    : goal.status === "denied"
                    ? "✕ denied"
                    : ""}
                </p>
              </div>
            ) : (
              <div className="mb-1 w-32 -rotate-3 rounded-xl bg-cream p-3 text-midnight shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                <p className="text-[9px] font-black uppercase tracking-widest text-midnight/40">
                  Today
                </p>
                <p className="mt-0.5 text-[11px] font-extrabold leading-tight">
                  No goal yet
                </p>
                <p className="mt-1 text-[9px] font-bold text-midnight/50">
                  set one above
                </p>
              </div>
            )}
          </div>
          <div className="pointer-events-none mx-auto mt-1 h-2 w-[86%] rounded-[100%] bg-black/25 blur-[6px]" />
          <p className="pb-3 pt-2 text-center text-xs font-medium tracking-wide text-base-content/50">
            {goal?.status === "approved"
              ? "Green light — your plan is approved. Dock to begin."
              : goal?.status === "denied"
              ? "The lamp glows red: this goal was denied."
              : "Your desk stays private — no camera, no recordings."}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
              Today&apos;s goal
            </h2>
            <span className="badge badge-ghost border-base-300/60 text-xs">
              {goal?.status === "approved"
                ? "Approved ✓"
                : goal?.status === "denied"
                ? "Denied"
                : goal?.status === "waiting"
                ? "Waiting for approval"
                : "No goal set"}
            </span>
          </div>

          {goal ? (
            <>
              <p className="mt-3 font-display text-lg font-extrabold">
                {goal.subject} · {goal.topic}
              </p>
              {goal.details && (
                <p className="mt-1 text-sm text-base-content/60">
                  {goal.details}
                </p>
              )}
              {goal.status === "approved" && (
                <p className="mt-2 text-sm text-base-content/60">
                  Parent-set block:{" "}
                  <span className="font-extrabold text-base-content">
                    {goal.timerMinutes} minutes
                  </span>
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-base-content/70">
              {profile
                ? "No study goal yet. Set one and your parent will review it in a moment."
                : "Set up your profile first, then we'll set your first goal."}
            </p>
          )}
        </section>

        <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
          {!profile ? (
            <Link
              href="/profile"
              className="btn btn-primary btn-lg h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
            >
              Set Up My Profile
            </Link>
          ) : goal?.status === "approved" ? (
            <Link
              href="/focus"
              className="btn btn-primary btn-lg h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
            >
              Dock &amp; Focus
            </Link>
          ) : goal?.status === "waiting" ? (
            <Link
              href="/waiting"
              className="btn btn-primary btn-lg h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
            >
              Check Approval
            </Link>
          ) : goal?.status === "denied" ? (
            <Link
              href="/goal"
              className="btn btn-primary btn-lg h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
            >
              Set a New Goal
            </Link>
          ) : (
            <Link
              href="/goal"
              className="btn btn-primary btn-lg h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
            >
              Set Today&apos;s Goal
            </Link>
          )}
          <p className="text-center text-xs text-base-content/40">
            One approved block of focus at a time.
          </p>
        </div>
      </main>
    </div>
  );
}