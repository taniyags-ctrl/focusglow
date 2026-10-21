"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Lamp from "@/components/Lamp";
import {
  getGoal,
  getProfile,
  getSession,
  saveSession,
  finishSession,
  uid,
  type Session,
} from "@/lib/mock-store";

function fmt(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function FocusPage() {
  const router = useRouter();
  const [docked, setDocked] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goal = getGoal();
  const profile = getProfile();

  function stopInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      setSession(existing);
      setDocked(existing.status === "locked" || existing.status === "paused");
      if (existing.status === "locked") {
        intervalRef.current = tick(existing);
      }
    }
  }, []);

  function tick(active: Session) {
    return setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        saveSession(next);
        if (next.remainingSeconds <= 0) {
          stopInterval();
          router.push("/quiz");
        }
        return next;
      });
      void active;
    }, 1000);
  }

  function dock() {
    if (!goal || goal.status !== "approved") return;
    const s: Session = {
      id: uid(),
      goalId: goal.id,
      subject: goal.subject,
      topic: goal.topic,
      material: goal.material || "",
      timerSeconds: goal.timerMinutes * 60,
      remainingSeconds: goal.timerMinutes * 60,
      status: "locked",
      startedAt: Date.now(),
      credits: 0,
    };
    saveSession(s);
    setSession(s);
    setDocked(true);
    intervalRef.current = tick(s);
  }

  function leaveDesk() {
    stopInterval();
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, status: "paused" as const };
      saveSession(next);
      return next;
    });
  }

  function returnDesk() {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, status: "locked" as const };
      saveSession(next);
      intervalRef.current = tick(next);
      return next;
    });
  }

  function breakFocus() {
    stopInterval();
    if (!session) {
      router.push("/");
      return;
    }
    const failed: Session = {
      ...session,
      status: "failed",
      finishedAt: Date.now(),
    };
    finishSession(failed);
    router.push(`/result?status=failed&reason=phone`);
  }

  useEffect(() => {
    return () => stopInterval();
  }, []);

  if (!goal || goal.status !== "approved") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-base-content/60">
          No approved goal yet — ask your parent first.
        </p>
        <button
          onClick={() => router.push("/")}
          className="btn btn-primary rounded-full"
        >
          Back home
        </button>
      </div>
    );
  }

  if (!docked) {
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
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,178,76,0.12),transparent_70%)]" />
          <div className="relative mx-auto w-48">
            <Lamp state="idle" />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
            Approved plan
          </h2>
          <p className="mt-2 font-display text-lg font-extrabold">
            {goal.subject} · {goal.topic}
          </p>
          <p className="mt-1 text-sm text-base-content/60">
            Block length:{" "}
            <span className="font-extrabold text-base-content">
              {goal.timerMinutes} minutes
            </span>{" "}
            (set by your parent)
          </p>
        </section>

        <section className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative flex h-44 w-24 items-center justify-center rounded-[1.4rem] border-2 border-base-300/70 bg-base-300/40 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
            </div>
            <div className="mx-auto mt-3 h-2 w-24 rounded-[100%] bg-black/30 blur-[4px]" />
          </div>
          <h1 className="font-display text-xl font-extrabold">
            Dock your phone to begin
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-base-content/60">
            Place it on the magnetic base. Distracting apps lock automatically
            and the lamp turns on bright.
          </p>
        </section>

        <button
          onClick={dock}
          className="btn btn-primary btn-lg h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
        >
          Dock &amp; Focus
        </button>
        <p className="mt-3 text-center text-xs text-base-content/40">
          {profile?.name ? `Ready when you are, ${profile.name}.` : "Ready when you are."}
        </p>
      </div>
    );
  }

  const paused = session?.status === "paused";
  const remaining = session?.remainingSeconds ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-6">
      <header className="flex items-center justify-between">
        <span className="font-display text-sm font-extrabold tracking-tight">
          Focus<span className="text-primary">Glow</span>
        </span>
        <span
          className={
            paused
              ? "badge border-base-300/60 bg-base-300/70 py-2.5 text-xs font-bold text-base-content/60"
              : "badge gap-1.5 border-transparent bg-primary/15 py-2.5 text-xs font-bold text-primary"
          }
        >
          {paused ? (
            "Timer paused"
          ) : (
            <>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              FOCUS — locked in
            </>
          )}
        </span>
      </header>

      <section className="mt-4">
        <p className="font-display text-lg font-extrabold">
          {goal.subject} · {goal.topic}
        </p>
        <p className="text-xs text-base-content/40">Timer set by parent · {goal.timerMinutes} min</p>
      </section>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-base-300/60 bg-base-200/60 px-6 pt-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,178,76,0.14),transparent_70%)]" />
        <div className="relative mx-auto w-52">
          <Lamp state={paused ? "idle" : "active"} />
        </div>
        <div className="pb-6 text-center">
          <span className="font-display text-6xl font-black tabular-nums tracking-tight">
            {fmt(remaining)}
          </span>
          <p className="mt-1 text-xs text-base-content/40">
            {paused
              ? "The sensor noticed you left — the block is paused."
              : "Stay at your desk. The sensor pauses the timer if you leave."}
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
        {paused ? (
          <button
            onClick={returnDesk}
            className="btn btn-primary h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
          >
            Demo: I&apos;m back (sensor would detect this)
          </button>
        ) : (
<button
          onClick={leaveDesk}
          className="btn btn-ghost h-12 w-full rounded-full border border-base-300/60 font-bold text-base-content/60"
        >
          Demo: leave the desk (the sensor would detect this)
        </button>
        )}
        <button
          onClick={breakFocus}
          className="text-center text-xs text-base-content/40 hover:text-accent"
        >
          Demo: simulate picking up the phone for non-study use
        </button>
        <button
          onClick={() => {
            stopInterval();
            router.push("/quiz");
          }}
          className="text-center text-xs text-base-content/40 hover:text-primary"
        >
          Demo: skip the timer to the quiz
        </button>
      </div>
    </div>
  );
}