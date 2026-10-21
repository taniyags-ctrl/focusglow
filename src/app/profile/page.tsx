"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Lamp from "@/components/Lamp";
import { saveProfile } from "@/lib/mock-store";

const grades = ["6", "7", "8", "9", "10", "11", "12"];

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");

  const ready = name.trim().length > 0 && grade !== "" && subject.trim().length > 0;

  function finish() {
    if (!ready) return;
    saveProfile({
      name: name.trim(),
      grade,
      subject: subject.trim(),
    });
    router.push("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
      <header className="flex items-center justify-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15">
          <span className="h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_12px_rgba(255,178,76,0.9)]" />
        </span>
        <span className="font-display text-lg font-extrabold tracking-tight">
          Focus<span className="text-primary">Glow</span>
        </span>
      </header>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-base-300/60 bg-base-200/60 px-6 pt-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,178,76,0.12),transparent_70%)]" />
        <div className="relative mx-auto w-40">
          <Lamp state="idle" />
        </div>
      </section>

      <section className="mt-6 text-center">
        <h1 className="font-display text-2xl font-extrabold leading-tight">
          First, let&apos;s meet you
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          One quick setup, then we&apos;re ready to protect your focus.
        </p>
      </section>

      <section className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul"
            className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">
            Grade / class
          </span>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="select w-full rounded-2xl border-base-300/60 bg-base-200/60 font-semibold"
          >
            <option value="" disabled>
              Tap to choose your grade
            </option>
            {grades.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">
            Your favourite or hardest subject
          </span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Maths"
            className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
          />
          <span className="text-xs text-base-content/40">
            This helps us suggest good study goals later.
          </span>
        </label>
      </section>

      <div className="mt-8 flex flex-1 flex-col justify-end">
        <button
          onClick={finish}
          disabled={!ready}
          className="btn btn-primary h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)] disabled:border-transparent disabled:bg-base-300 disabled:text-base-content/40 disabled:shadow-none"
        >
          Save &amp; Start Focusing
        </button>
        <p className="mt-3 text-center text-xs text-base-content/40">
          Only this family sees your details. No camera, no recordings.
        </p>
      </div>
    </div>
  );
}