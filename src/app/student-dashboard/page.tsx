"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lamp from "@/components/Lamp";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<{ name: string; id: string } | null>(null);
  const [goal, setGoal] = useState<{ subject: string; chapter: string } | null>(null);
  const [session, setSession] = useState<{ status: string; duration?: number } | null>(null);
  const [credits, setCredits] = useState(0);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    emailjs.init("52_Jbl6Se0bknE7uj");
  }, []);

  useEffect(() => {
    const profileRef = ref(db, "students/" + (profile?.id || "temp") + "/details");
    const sessionRef = ref(db, "students/" + (profile?.id || "temp") + "/session");

    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.name) {
        setProfile({ name: data.name, id: data.id || "temp" });
        setShowForm(false);
      } else {
        setProfile(null);
        setShowForm(true);
      }
    });

    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      setSession({
        status: data?.status || "waiting",
        duration: data?.duration,
      });
    });
  }, [profile]);

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const name = (target.elements.namedItem("name") as HTMLInputElement).value;
    const subject = (target.elements.namedItem("subject") as HTMLInputElement).value;
    const chapter = (target.elements.namedItem("chapter") as HTMLInputElement).value;

    const id = crypto.randomUUID();
    set(ref(db, "students/" + id + "/details"), { name, subject, chapter });

    setProfile({ name, id });
    setShowForm(false);

    // Send email to parent via EmailJS
    const templateParams = {
      student_name: name,
      subject: subject,
      chapter: chapter,
      dashboard_link: `${window.location.origin}/parent?studentId=${id}`,
    };
    emailjs.send(
      "service_ikolp7d",
      "template_9wie4gm",
      templateParams,
      "52_Jbl6Se0bknE7uj"
    ).then(
      (result: EmailJSResponseStatus) => {
        console.log("Email sent successfully", result.status, result.text);
      },
      (error) => {
        console.error("Failed to send email", error);
      }
    );
  };

  if (showForm) {
    return (
      <div className="mx-auto flex w-full max-w-md p-6 flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold">Welcome to FocusGlow</h1>
          <p className="text-base-content/60 mt-4">
            Please set up your profile to begin your first study session.
          </p>
          <form onSubmit={submitProfile} className="mt-6 flex flex-col gap-4 max-w-sm w-full">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-base-content/70">Name</span>
              <input
                type="text"
                required
                placeholder="e.g. Alex"
                className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
                name="name"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-base-content/70">Subject</span>
              <input
                type="text"
                placeholder="e.g. Maths"
                className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
                name="subject"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-base-content/70">Chapter</span>
              <input
                type="text"
                placeholder="e.g. Chapter 4"
                className="input w-full rounded-2xl border-base-300/60 bg-base-200/60 placeholder:text-base-content/30"
                name="chapter"
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]"
            >
              Save Details
            </button>
          </form>
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
            {session?.status === "active" ? "Active" : session?.status === "approved" ? "Approved" : "Waiting"}
          </span>
        </div>
      </header>

      {session?.status === "active" && session?.duration && (
        <section className="mb-6">
          <h2 className="font-display text-lg font-extrabold mb-3">Session Active</h2>
          <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
            <p className="font-bold text-base-content/70">{goal?.subject} · {goal?.chapter}</p>
            <p className="text-xs text-base-content/50">
              Duration: {session.duration} min
            </p>
            <Lamp state="active" className="mt-3" />
          </div>
        </section>
      )}

      {session?.status === "approved" && (
        <section className="mb-6">
          <h2 className="font-display text-lg font-extrabold mb-3">Session Approved</h2>
          <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
            <p className="font-bold text-base-content/70">{goal?.subject} · {goal?.chapter}</p>
            <p className="text-xs text-base-content/50">
              Approved for {session.duration} minutes
            </p>
            <Lamp state="active" className="mt-3" />
          </div>
        </section>
      )}

      {session?.status === "waiting" && (
        <section className="mb-6">
          <h2 className="font-display text-lg font-extrabold mb-3">Waiting for Approval</h2>
          <div className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
            <p className="font-bold text-base-content/70">{goal?.subject} · {goal?.chapter}</p>
            <p className="text-xs text-base-content/50">Waiting for parent approval</p>
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
            <p className="text-sm opacity-60">Chapter</p>
            <p className="font-medium">{goal?.chapter}</p>
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

      <section className="mt-4">
        <Link
          href="/parent"
          className="btn btn-primary w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)]">
          Start New Session
        </Link>
        <Link
          href="/"
          className="btn btn-ghost w-full rounded-full border border-base-300/60 font-bold text-base-content/60 mt-3">
          Logout
        </Link>
      </section>
    </div>
  );
}