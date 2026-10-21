"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // adjust path if your firebase config is elsewhere

export default function ParentDashboard({ params }) {
  const [student, setStudent] = useState(null);
  const [selectedTime, setSelectedTime] = useState(20);

  // Fetch student details from Firebase
  useEffect(() => {
    const studentId = params?.studentId || "defaultStudent";
    const ref = db.ref(`students/${studentId}`);
    ref.on("value", (snapshot) => setStudent(snapshot.val()));
  }, [params]);

  // Parent approves session
  const approveSession = () => {
    const studentId = params?.studentId || "defaultStudent";
    db.ref(`students/${studentId}/session`).set({
      subject: student.subject,
      timer: selectedTime,
      status: "approved"
    });
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Review {student?.name}'s Goal</h2>
      <p>Request delivered to {student?.parentEmail}</p>

      <div style={{ marginTop: "20px" }}>
        <h3>Today's Portion</h3>
        <p>{student?.subject} · {student?.chapter}</p>
      </div>

      <h3>How long should this block last?</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {[10, 15, 20, 25, 30, 40, 50, 60].map((m) => (
          <button
            key={m}
            onClick={() => setSelectedTime(m)}
            style={{
              backgroundColor: selectedTime === m ? "#4b3fff" : "#ddd",
              color: selectedTime === m ? "white" : "black",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {m}m
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={approveSession}
          style={{
            backgroundColor: "#4b3fff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Approve & Start Session
        </button>
      </div>
    </div>
  );
}
