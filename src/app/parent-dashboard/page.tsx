"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";

export default function ParentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<{ name: string; goal: string } | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  useEffect(() => {
    const studentRef = ref(db, "students/temp/details");
    onValue(studentRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.name) {
        setStudent({ name: data.name, goal: data.subject + " · " + data.chapter });
      }
    });
  }, []);

  const approveSession = () => {
    if (!student || !selectedDuration) return;

    const sessionRef = ref(db, "students/temp/session");
    set(sessionRef, {
      goal: student.goal,
      duration: selectedDuration,
      approved: true,
      status: "active",
    });

    setConfirmation(`Session approved for ${selectedDuration} minutes!`);
    setSelectedDuration(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-md p-6 bg-base-100 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-extrabold">Parent Dashboard</h1>
          <p className="text-base-content/60">FocusGlow Study Session</p>
        </div>
        <Link
          href="/"
          className="btn btn-ghost text-sm rounded-full border border-base-300/60 font-bold text-base-content/60"
        >
          ← Back
        </Link>
      </header>

      {!student ? (
        <div className="text-center mb-8">
          <h2 className="font-display text-lg font-extrabold">Student Not Found</h2>
          <p className="mt-2 text-base-content/60">Ask the student to set up their profile first.</p>
        </div>
      ) : (
        <div>
          <section className="mb-6">
            <h2 className="font-display text-lg font-extrabold mb-3">Student</h2>
            <div className="bg-base-200/50 rounded-xl p-4">
              <p className="font-medium">{student?.name}</p>
              <p className="text-sm text-base-content/60">{student?.goal}</p>
            </div>
          </section>

          {confirmation ? (
            <div className="mb-6 rounded-2xl border border-success/60 bg-success/10 p-4 text-center">
              <p className="font-display text-base-content/70">{confirmation}</p>
            </div>
          ) : null}

          <section>
            <h2 className="font-display text-lg font-extrabold mb-3">Approve Session Duration</h2>
            <p className="text-base-content/60 mb-4">
              Select how long the student should study (in minutes):
            </p>
            <div className="flex gap-2">
              {[10, 30, 60, 90, 120, 150, 180].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className="btn btn-outline h-12 w-24 rounded-full text-sm font-bold"
                >
                  {dur} min
                </button>
              ))}
            </div>
          </section>

          {selectedDuration && (
            <div className="mt-6 p-4 bg-base-200/50 rounded-xl">
              <p className="font-bold text-base-content/70">
                Approving {selectedDuration} minute session for {student?.name}
              </p>
              <button
                onClick={approveSession}
                className="btn btn-primary w-full rounded-full text-base font-extrabold shadow-[0_8px_30px_rgba(255,178,76,0.35)] mt-3"
              >
                Approve
              </button>
            </div>
          )}

          <div className="mt-6">
            <Link
              href="/student"
              className="btn btn-ghost w-full rounded-full border border-base-300/60 font-bold text-base-content/60 mt-3">
              Refresh
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}