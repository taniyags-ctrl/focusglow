"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, saveGoal, uid } from "@/lib/mock-store";

export default function GoalPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [material, setMaterial] = useState("");
  const [parentContact, setParentContact] = useState("");

  useEffect(() => {
    const profile = getProfile();
    if (profile?.subject) setSubject(profile.subject);
  }, []);

  const ready =
    subject.trim().length > 0 &&
    topic.trim().length > 0 &&
    parentContact.trim().length > 0;

  function submit() {
    if (!ready) return;
    saveGoal({
      id: uid(),
      subject: subject.trim(),
      topic: topic.trim(),
      details: details.trim(),
      material: material.trim(),
      parentContact: parentContact.trim(),
      status: "waiting",
      timerMinutes: 0,
      createdAt: Date.now(),
    });
    router.push("/waiting");
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
        <span className="font-display text-sm font-extrabold tracking-tight">
          Focus<span className="text-primary">Glow</span>
        </span>
      </header>

      <section className="mt-8">
        <h1 className="font-display text-2xl font-extrabold leading-tight">
          Set today&apos;s goal
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Speak it or type it. Your parent reviews it in a moment.
        </p>
      </section>

      <section className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Maths"
            className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">
            Topic / chapter
          </span>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Chapter 4, Exercises 1 to 10"
            className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">
            Parent&apos;s phone number or email
          </span>
          <input
            value={parentContact}
            onChange={(e) => setParentContact(e.target.value)}
            placeholder="e.g. 98XXXXXXXX or mummy@gmail.com"
            className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
          />
          <span className="text-xs text-base-content/40">
            The approval request is sent to them on their own phone — you never
            hand over yours.
          </span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">
            Extra details <span className="font-normal text-base-content/40">(optional)</span>
          </span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. Focus on the word problems"
            rows={3}
            className="textarea w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-base-content/70">
            Study material <span className="font-normal text-base-content/40">(paste or type notes)</span>
          </span>
          <textarea
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={"Paste your notes here, e.g.\n\nQuadrilateral: A polygon with 4 sides.\nTypes: Square, Rectangle, Parallelogram, Trapezium.\nAngle sum = 360 degrees.\nDiagonals bisect each other in a parallelogram."}
            rows={6}
            className="textarea w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30 text-sm"
          />
          <span className="text-xs text-base-content/40">
            Your quiz questions will be generated from this material. The more you paste, the better the questions.
          </span>
        </label>
      </section>

      <div className="mt-8 flex flex-1 flex-col justify-end">
        <button
          onClick={submit}
          disabled={!ready}
          className="btn btn-primary h-14 w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)] disabled:border-transparent disabled:bg-base-300 disabled:text-base-content/40 disabled:shadow-none"
        >
          Send to Parent&apos;s Phone
        </button>
        <p className="mt-3 text-center text-xs text-base-content/40">
          A notification is sent to the number you entered above.
        </p>
      </div>
    </div>
  );
}