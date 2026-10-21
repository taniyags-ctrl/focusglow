"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lamp from "@/components/Lamp";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [goal, setGoal] = useState<{ subject: string; topic: string } | null>(null);
  const [session, setSession] = useState<{ status: string } | null>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const p = profile?.name || null;
    if (p) setProfile({ name: p });
    const g = goal?.subject && goal?.topic ? goal : null;
    if (g) setGoal(g);
    const s = session?.status || null;
    if (s) setSession({ status: s });
  }, [profile]);

  if (!profile) {
    return (
      <div className="mx-auto flex w-full max-w-md p-6 flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold">Welcome to FocusGlow</h1>
          <p className="text-base-content/60 mt-4">
            Please set up your profile to begin your first study session.
          </p>
          <Link
            href="/goal"
            className="btn btn-primary mt-6 rounded-full text-base font-extrabold"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl p-6 bg-base-100 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-extrabold">Welcome, {profile?.name}</h1>
          <p className="text-base-content/60">Your focus dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-base-300/70 px-2 py-1 text-xs font-bold text-base-content/70">
            {session?.status === "active" ? "Active" : session?.status === "failed" ? "Failed" : "Paused"}
          </span>
        </div>
      </header>

      {session && session.status === "active" && (
        <section className="mb-6">
          <h2 className="font-display text-lg font-extrabold mb-3">Session Active</h2>
          <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
            <p className="font-bold text-base-content/70">{goal?.subject} · {goal?.topic}</p>
            <Lamp state="active" className="mt-3" />
          </div>
        </section>
      )}

      {session && session.status === "failed" && (
        <section className="mb-6">
          <h2 className="font-display text-lg font-extrabold mb-3">Session Failed</h2>
          <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
            <p className="font-bold text-base-content/70">{goal?.subject} · {goal?.topic}</p>
            <Lamp state="failed" className="mt-3" />
          </div>
        </section>
      )}

      {session && session.status === "paused" && (
        <section className="mb-6">
          <h2 className="font-display text-lg font-extrabold mb-3">Session Paused</h2>
          <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
            <p className="font-bold text-base-content/70">{goal?.subject} · {goal?.topic}</p>
            <Lamp state="active" className="mt-3" />
          </div>
        </section>
      )}

      {goal && (
        <section className="mb-6">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
            Current Goal
          </h2>
          <div className="bg-[color:base-200] rounded-xl p-4">
            <p className="text-sm opacity-60">Subject</p>
            <p className="font-medium">{goal?.subject}</p>
            <p className="text-sm opacity-60">Topic</p>
            <p className="font-medium">{goal?.topic}</p>
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
          Your Credits
        </h2>
        <div className="flex items-center gap-2">
          <span className="font-display text-3xl font-black text-secondary">{credits} ⭐</span>
          <span className="text-xs text-base-content/50">earned so far</span>
        </div>
      </section>

      <div className="mt-8">
        <Link
          href="/goal"
          className="btn btn-primary w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]">
          Start New Session
        </Link>
        <Link
          href="/"
          className="btn btn-ghost w-full rounded-full border border-base-300/60 font-bold text-base-content/60 mt-3">
          Logout
        </Link>
      </div>
    </div>
  );
}