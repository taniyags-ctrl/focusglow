"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lamp from "@/components/Lamp";
import {
  getGoal,
  getProfile,
  getHistory,
  getCredits,
  type Session,
} from "@/lib/mock-store";

function when(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardPage() {
  const [history, setHistory] = useState<Session[]>([]);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    setHistory(getHistory());
    setCredits(getCredits());
  }, []);

  const goal = getGoal();
  const profile = getProfile();
  const passedToday = history.filter(
    (s) => s.status === "passed" && new Date(s.startedAt).toDateString() === new Date().toDateString()
  ).length;

  function QuizReview({ session }: { session: Session }) {
  if (!session.quiz || session.quiz.length === 0) return null;
  return (
    <div className="collapse collapse-arrow mt-3 border-t border-base-300/40 rounded-none">
      <input type="checkbox" className="min-h-0" />
      <div className="collapse-title flex items-center justify-between py-2 pr-0 text-xs font-bold text-base-content/60">
        <span>Full session report</span>
        <span className="text-base-content/40">
          {session.quiz.filter((r) => r.correct).length}/{session.quiz.length} correct
        </span>
      </div>
      <div className="collapse-content px-0">
        {/* Understanding Section */}
        <div className="mb-3 rounded-xl border border-base-300/60 bg-base-200/40 p-3.5">
          <p className="text-xs font-bold text-base-content/50 uppercase">Understanding Check</p>
          <p className="mt-1 text-sm">
            {session.understood ? (
              <span className="text-secondary">Student understood the concepts</span>
            ) : (
              <span className="text-accent">Student needed help with some concepts</span>
            )}
          </p>
          {session.unclearConcepts && (
            <div className="mt-2 rounded-lg bg-accent/10 p-2">
              <p className="text-xs font-bold text-accent">Unclear concepts:</p>
              <p className="mt-0.5 text-xs text-base-content/70">{session.unclearConcepts}</p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        {session.summary && (
          <div className="mb-3 rounded-xl border border-base-300/60 bg-base-200/40 p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-base-content/50 uppercase">Student Summary</p>
              <span className={`text-xs font-bold ${session.summaryPassed ? 'text-secondary' : 'text-accent'}`}>
                {session.summaryPassed ? '✓ Good' : '✕ Needs work'}
              </span>
            </div>
            <div className="mt-2 space-y-2 text-xs text-base-content/70">
              {session.summary.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Results */}
        <ul className="space-y-3">
          {session.quiz.map((r, i) => (
            <li key={i} className="rounded-xl border border-base-300/60 bg-base-200/40 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold leading-snug">{r.question}</p>
                <span
                  className={
                    r.correct
                      ? "text-sm font-black text-secondary"
                      : "text-sm font-black text-accent"
                  }
                >
                  {r.correct ? "✓" : "✕"}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-xs leading-relaxed">
                <p className={r.correct ? "text-secondary" : "text-accent"}>
                  Student answer: {r.answer}
                </p>
                {!r.correct && (
                  <p className="text-base-content/80">
                    Expected: {r.correctAnswer}
                  </p>
                )}
                <p className="text-base-content/50">{r.explanation}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Parent Message */}
        {session.parentMessage && (
          <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3.5">
            <p className="text-xs font-bold text-primary uppercase">Message to Parent</p>
            <p className="mt-1 text-sm text-base-content/80">{session.parentMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const statusBadge = (s: Session) => {
    if (s.status === "passed")
      return <span className="badge border-transparent bg-secondary/15 text-xs font-bold text-secondary">Passed</span>;
    if (s.status === "failed")
      return <span className="badge border-transparent bg-accent/15 text-xs font-bold text-accent">Failed</span>;
    return <span className="badge badge-ghost border-base-300/60 text-xs">{s.status}</span>;
  };

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

      <section className="mt-6">
        <h1 className="font-display text-2xl font-extrabold">
          {profile ? `${profile.name}'s focus report` : "Focus report"}
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          {new Date().toLocaleDateString([], {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </section>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-base-300/60 bg-base-200/60 px-6 pt-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,178,76,0.12),transparent_70%)]" />
        <div className="relative mx-auto w-40">
          <Lamp state={goal?.status === "approved" ? "passed" : "idle"} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
          <p className="text-xs font-bold text-base-content/50">Blocks today</p>
          <p className="mt-1 font-display text-2xl font-black text-base-content">
            {passedToday}
          </p>
        </div>
        <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
          <p className="text-xs font-bold text-base-content/50">Credits</p>
          <p className="mt-1 font-display text-2xl font-black text-secondary">
            {credits} ⭐
          </p>
        </div>
        <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
          <p className="text-xs font-bold text-base-content/50">Today&apos;s goal</p>
          <p className="mt-1 font-display text-2xl font-black text-base-content">
            {goal ? "1 set" : "0"}
          </p>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
          Today&apos;s goal
        </h2>
        {goal ? (
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-extrabold">
                {goal.subject} · {goal.topic}
              </p>
              <p className="mt-0.5 text-xs text-base-content/50">
                {goal.status === "approved"
                  ? `Approved · ${goal.timerMinutes} min block`
                  : goal.status === "denied"
                  ? "Denied by you"
                  : "Waiting for your approval"}
              </p>
            </div>
            {goal.status === "approved" ? (
              <Link href="/parent" className="btn btn-primary btn-sm rounded-full text-xs font-bold">
                Review
              </Link>
            ) : goal.status === "waiting" ? (
              <Link href="/parent" className="btn btn-primary btn-sm rounded-full text-xs font-bold">
                Review
              </Link>
            ) : (
              <span className="badge border-transparent bg-accent/15 text-xs font-bold text-accent">
                Denied
              </span>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-base-content/60">
            No goal set today yet.
          </p>
        )}
      </section>

      <section className="mt-5 flex-1">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
          Session history
        </h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-base-content/60">
            No focus sessions yet. They&apos;ll appear here once your child
            completes their first block.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {history.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">
                      {s.subject} · {s.topic}
                    </p>
                    <p className="mt-0.5 text-xs text-base-content/50">
                      {s.timerSeconds / 60} min · started {when(s.startedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {s.credits > 0 && (
                      <span className="text-xs font-black text-secondary">
                        +{s.credits} ⭐
                      </span>
                    )}
                    {statusBadge(s)}
                  </div>
                </div>
                <QuizReview session={s} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8">
        <Link
          href="/"
          className="btn btn-ghost h-12 w-full rounded-full border border-base-300/60 font-bold text-base-content/60"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}