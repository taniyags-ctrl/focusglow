"use client";

import { useReducer, useState, useEffect, useRef } from "react";
import Lamp from "@/components/Lamp";

type SimState =
  | "idle"
  | "student_arrives"
  | "app_opened"
  | "goal_set"
  | "parent_notified"
  | "parent_approved"
  | "parent_denied"
  | "phone_docked"
  | "focus_active"
  | "student_leaves"
  | "student_returns"
  | "phone_picked_up"
  | "phone_return_countdown"
  | "session_complete"
  | "quiz_active"
  | "quiz_passed"
  | "quiz_failed"
  | "reward_released";

type TimelineEntry = { time: string; event: string; color: string };

type Action =
  | { type: "STUDENT_ARRIVES" }
  | { type: "OPEN_APP" }
  | { type: "SET_GOAL" }
  | { type: "NOTIFY_PARENT" }
  | { type: "APPROVE" }
  | { type: "DENY" }
  | { type: "DOCK_PHONE" }
  | { type: "LEAVE_DESK" }
  | { type: "RETURN_DESK" }
  | { type: "PICK_UP_PHONE" }
  | { type: "RETURN_PHONE" }
  | { type: "PHONE_TIMEOUT" }
  | { type: "SESSION_COMPLETE" }
  | { type: "START_QUIZ" }
  | { type: "PASS_QUIZ" }
  | { type: "FAIL_QUIZ" }
  | { type: "RELEASE_REWARD" }
  | { type: "RESET" };

function reducer(
  state: SimState,
  action: Action
): { next: SimState; event: string; color: string } {
  switch (action.type) {
    case "STUDENT_ARRIVES":
      return { next: "student_arrives", event: "Student arrives at desk — heat sensor detects body warmth", color: "text-base-content" };
    case "OPEN_APP":
      return state === "student_arrives"
        ? { next: "app_opened", event: "Student opens the FocusGlow app", color: "text-primary" }
        : { next: state, event: "Cannot open app yet", color: "text-accent" };
    case "SET_GOAL":
      return state === "app_opened"
        ? { next: "goal_set", event: "Goal set with study material uploaded", color: "text-primary" }
        : { next: state, event: "Cannot set goal yet", color: "text-accent" };
    case "NOTIFY_PARENT":
      return state === "goal_set"
        ? { next: "parent_notified", event: "Notification sent to parent's phone", color: "text-info" }
        : { next: state, event: "Cannot notify yet", color: "text-accent" };
    case "APPROVE":
      return state === "parent_notified"
        ? { next: "parent_approved", event: "Parent approved · study block begins", color: "text-success" }
        : { next: state, event: "No pending request", color: "text-accent" };
    case "DENY":
      return state === "parent_notified"
        ? { next: "parent_denied", event: "Parent denied the goal", color: "text-accent" }
        : { next: state, event: "No pending request", color: "text-accent" };
    case "DOCK_PHONE":
      return state === "parent_approved"
        ? { next: "phone_docked", event: "Phone docked on NFC base — apps locked", color: "text-primary" }
        : { next: state, event: "Cannot dock yet", color: "text-accent" };
    case "LEAVE_DESK":
      return state === "focus_active" || state === "student_returns"
        ? { next: "student_leaves", event: "Heat sensor lost body warmth — student away! Timer paused.", color: "text-warning" }
        : { next: state, event: "Not in focus mode", color: "text-accent" };
    case "RETURN_DESK":
      return state === "student_leaves"
        ? { next: "student_returns", event: "Heat sensor detects warmth — student returned. Timer resumes.", color: "text-secondary" }
        : { next: state, event: "Student hasn't left", color: "text-accent" };
    case "PICK_UP_PHONE":
      return state === "focus_active" || state === "student_returns"
        ? { next: "phone_picked_up", event: "RED LIGHT! Phone out of dock detected! Timer reset warning!", color: "text-accent" }
        : { next: state, event: "Not in focus mode", color: "text-accent" };
    case "RETURN_PHONE":
      return state === "phone_picked_up"
        ? { next: "phone_return_countdown", event: "Return phone within 30 seconds or timer resets!", color: "text-warning" }
        : { next: state, event: "Phone is not picked up", color: "text-accent" };
    case "PHONE_TIMEOUT":
      return state === "phone_picked_up" || state === "phone_return_countdown"
        ? { next: "focus_active", event: "Phone returned — timer reset to full. Study continues.", color: "text-success" }
        : { next: state, event: "Nothing to return", color: "text-accent" };
    case "SESSION_COMPLETE":
      return state === "focus_active" || state === "student_returns"
        ? { next: "session_complete", event: "Timer hit zero — undock phone for quiz", color: "text-secondary" }
        : { next: state, event: "Timer hasn't ended", color: "text-accent" };
    case "START_QUIZ":
      return state === "session_complete"
        ? { next: "quiz_active", event: "Quiz starts — MCQ + Subjective questions from your study material", color: "text-primary" }
        : { next: state, event: "Session not complete", color: "text-accent" };
    case "PASS_QUIZ":
      return state === "quiz_active"
        ? { next: "quiz_passed", event: "Quiz passed — +10 credits earned!", color: "text-success" }
        : { next: state, event: "No active quiz", color: "text-accent" };
    case "FAIL_QUIZ":
      return state === "quiz_active"
        ? { next: "quiz_failed", event: "Quiz failed — no credits earned", color: "text-accent" }
        : { next: state, event: "No active quiz", color: "text-accent" };
    case "RELEASE_REWARD":
      return state === "quiz_passed"
        ? { next: "reward_released", event: "Apps unlocked · Reward released · Report sent to parent", color: "text-success" }
        : { next: state, event: "No reward to release", color: "text-accent" };
    case "RESET":
      return { next: "idle", event: "Simulation reset — ready to start again", color: "text-base-content" };
    default:
      return { next: state, event: "", color: "text-base-content" };
  }
}

const stateDescriptions: Record<SimState, {
  title: string;
  subtitle: string;
  lampState: "idle" | "active" | "passed" | "failed";
  docked: boolean;
  phoneOnDesk: boolean;
  phonePickedUp: boolean;
  timerRunning: boolean;
  heatDetected: boolean;
}> = {
  idle:                    { title: "Empty desk", subtitle: "Lamp off. No student present.", lampState: "idle", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: false },
  student_arrives:         { title: "Student arrives", subtitle: "Heat sensor detects body warmth at desk.", lampState: "idle", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  app_opened:              { title: "App opened", subtitle: "Student opens FocusGlow on their phone.", lampState: "idle", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  goal_set:                { title: "Goal set", subtitle: "Study material uploaded. Sent for approval.", lampState: "idle", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  parent_notified:         { title: "Waiting for parent", subtitle: "Notification on parent's phone.", lampState: "idle", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  parent_approved:         { title: "Approved!", subtitle: "Parent approved. Dock phone to begin.", lampState: "passed", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  parent_denied:           { title: "Denied", subtitle: "Parent denied the goal.", lampState: "failed", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  phone_docked:            { title: "Phone docked", subtitle: "NFC connected. Distracting apps locked.", lampState: "active", docked: true, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  focus_active:            { title: "Focus ON", subtitle: "Timer running. Heat sensor monitoring presence.", lampState: "active", docked: true, phoneOnDesk: false, phonePickedUp: false, timerRunning: true, heatDetected: true },
  student_leaves:          { title: "Student away", subtitle: "Heat sensor lost warmth. Timer paused.", lampState: "idle", docked: true, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: false },
  student_returns:         { title: "Student returned", subtitle: "Heat sensor detects warmth. Timer resumed.", lampState: "active", docked: true, phoneOnDesk: false, phonePickedUp: false, timerRunning: true, heatDetected: true },
  phone_picked_up:         { title: "RED ALERT!", subtitle: "Phone removed from dock! Return it NOW or timer resets!", lampState: "failed", docked: true, phoneOnDesk: false, phonePickedUp: true, timerRunning: false, heatDetected: true },
  phone_return_countdown:  { title: "Return phone!", subtitle: "30-second countdown. Place phone back on dock.", lampState: "failed", docked: true, phoneOnDesk: false, phonePickedUp: true, timerRunning: false, heatDetected: true },
  session_complete:        { title: "Session done", subtitle: "Timer done. Undock phone for quiz.", lampState: "passed", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
  quiz_active:             { title: "Quiz in progress", subtitle: "MCQ + Subjective from your study material.", lampState: "active", docked: false, phoneOnDesk: true, phonePickedUp: false, timerRunning: false, heatDetected: true },
  quiz_passed:             { title: "Quiz PASSED", subtitle: "2/3 correct. +10 credits!", lampState: "passed", docked: false, phoneOnDesk: true, phonePickedUp: false, timerRunning: false, heatDetected: true },
  quiz_failed:             { title: "Quiz FAILED", subtitle: "Less than 2 correct. No credits.", lampState: "failed", docked: false, phoneOnDesk: true, phonePickedUp: false, timerRunning: false, heatDetected: true },
  reward_released:         { title: "Reward!", subtitle: "Apps unlocked. Report sent to parent!", lampState: "passed", docked: false, phoneOnDesk: false, phonePickedUp: false, timerRunning: false, heatDetected: true },
};

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function SimulationPage() {
  const [simState, setSimState] = useState<SimState>("idle");
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [returnCountdown, setReturnCountdown] = useState(30);
  const returnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const info = stateDescriptions[simState];

  useEffect(() => {
    if (info.timerRunning) {
      setTimer(1800);
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [info.timerRunning]);

  useEffect(() => {
    if (simState === "phone_return_countdown") {
      setReturnCountdown(30);
      returnTimerRef.current = setInterval(() => {
        setReturnCountdown((c) => {
          if (c <= 1) {
            if (returnTimerRef.current) clearInterval(returnTimerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      if (returnTimerRef.current) clearInterval(returnTimerRef.current);
    }
    return () => { if (returnTimerRef.current) clearInterval(returnTimerRef.current); };
  }, [simState]);

  function handleAction(action: Action) {
    const result = reducer(simState, action);
    if (result.event && result.next !== simState) {
      setSimState(result.next);
      setTimeline((prev) => [...prev, { time: timestamp(), event: result.event, color: result.color }]);
    }
    if (result.event && result.next === simState && action.type !== "RESET") {
      setTimeline((prev) => [...prev, { time: timestamp(), event: `⚠ ${result.event}`, color: "text-accent" }]);
    }
  }

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [timeline]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const isRedAlert = simState === "phone_picked_up" || simState === "phone_return_countdown";

  return (
    <div className="flex min-h-dvh flex-col bg-base-100 text-base-content">
      <header className="border-b border-base-300/60 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-extrabold">
              Focus<span className="text-primary">Glow</span> — Virtual Demo
            </h1>
            <p className="text-xs text-base-content/50">
              Walk through every scenario. Click buttons to advance the story.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-base-300/70 px-3 py-1.5 text-xs font-bold text-base-content/60">
              {simState.replace(/_/g, " ")}
            </span>
            <button
              onClick={() => {
                setSimState("idle");
                setTimeline([]);
                setTimer(0);
                if (timerRef.current) clearInterval(timerRef.current);
                if (returnTimerRef.current) clearInterval(returnTimerRef.current);
              }}
              className="btn btn-ghost btn-sm rounded-full border border-base-300/60 text-xs"
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-6 p-6">
        {/* LEFT: Desk Scene */}
        <section className="flex flex-1 flex-col gap-4">
          <div className={`relative flex flex-1 flex-col items-center justify-end overflow-hidden rounded-3xl border ${isRedAlert ? "border-accent/80" : "border-base-300/60"} bg-gradient-to-b from-base-200/80 to-base-300/40 p-8 transition-all duration-500`}>
            {/* Red alert flash */}
            {isRedAlert && (
              <div className="pointer-events-none absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(224,101,91,0.25),transparent)]" />
            )}

            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-1000"
              style={{
                background:
                  info.lampState === "active"
                    ? "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,178,76,0.20), transparent)"
                    : info.lampState === "passed"
                    ? "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(91,191,164,0.18), transparent)"
                    : info.lampState === "failed"
                    ? "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(224,101,91,0.18), transparent)"
                    : "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.02), transparent)",
              }}
            />

            {/* Lamp */}
            <div className="relative mb-2 w-48">
              <Lamp state={info.lampState} />
            </div>

            {/* Phone dock area */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-6">
              {/* Dock base */}
              <div className="relative flex flex-col items-center">
                <div
                  className="h-2 w-20 rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor:
                      info.docked
                        ? info.lampState === "active"
                          ? "rgba(255,178,76,0.6)"
                          : info.lampState === "passed"
                          ? "rgba(91,191,164,0.5)"
                          : "rgba(224,101,91,0.5)"
                        : "rgba(100,100,120,0.3)",
                    boxShadow:
                      info.docked && info.lampState === "active"
                        ? "0 0 16px rgba(255,178,76,0.5)"
                        : "none",
                  }}
                />
                <span className="mt-1 text-[9px] font-bold text-base-content/40">NFC DOCK</span>
              </div>

              {/* Phone */}
              <div
                className="relative flex flex-col items-center transition-all duration-700"
                style={{
                  transform: info.phonePickedUp
                    ? "translateY(-40px) rotate(-5deg)"
                    : info.docked
                    ? "translateY(-4px)"
                    : "translateY(0)",
                }}
              >
                <div
                  className="h-28 w-16 rounded-xl border-2 transition-all duration-700"
                  style={{
                    borderColor: isRedAlert ? "rgba(224,101,91,0.9)" : "rgba(100,100,120,0.4)",
                    backgroundColor:
                      isRedAlert
                        ? "#2e1a1a"
                        : info.docked && info.lampState === "active"
                        ? "#1a1a2e"
                        : info.docked && info.lampState === "passed"
                        ? "#1a2e1a"
                        : "#262b40",
                    boxShadow: isRedAlert
                      ? "0 0 30px rgba(224,101,91,0.6), 0 4px 24px rgba(0,0,0,0.4)"
                      : info.docked
                      ? "0 4px 24px rgba(0,0,0,0.4)"
                      : "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="mx-1 mt-1 h-[calc(100%-4px)] rounded-lg p-1.5">
                    {isRedAlert ? (
                      <div className="flex h-full flex-col items-center justify-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[7px] font-bold text-accent">⚠ RETURN!</span>
                        <span className="text-[8px] font-black text-accent tabular-nums">{returnCountdown}s</span>
                      </div>
                    ) : info.docked ? (
                      <div className="flex h-full flex-col items-center justify-center gap-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        <span className="text-[7px] font-bold text-primary/80">LOCKED</span>
                      </div>
                    ) : info.phoneOnDesk ? (
                      <div className="flex h-full flex-col items-center justify-center gap-0.5">
                        <span className="text-[8px] font-bold text-primary">QUIZ</span>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-0.5">
                        <span className="text-[6px] text-base-content/40">📱</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="mt-1 text-[9px] font-bold text-base-content/40">PHONE</span>
              </div>
            </div>

            {/* Heat Sensor */}
            <div className="absolute bottom-8 left-8 flex flex-col items-center gap-1">
              <div
                className="h-4 w-4 rounded-full border-2 transition-colors duration-500"
                style={{
                  borderColor: info.heatDetected
                    ? info.timerRunning
                      ? "rgba(255,178,76,0.9)"
                      : "rgba(255,178,76,0.5)"
                    : "rgba(100,100,120,0.3)",
                  backgroundColor: info.heatDetected
                    ? "rgba(255,178,76,0.35)"
                    : "transparent",
                  boxShadow: info.heatDetected
                    ? "0 0 12px rgba(255,178,76,0.6)"
                    : "none",
                }}
              />
              <span className="text-[8px] font-bold text-base-content/40">HEAT SENSOR</span>
              <span className="text-[7px] text-base-content/30">
                {!info.heatDetected
                  ? "⚠ NO PRESENCE"
                  : info.timerRunning
                  ? "✓ PRESENT & STUDYING"
                  : "✓ PRESENT"}
              </span>
            </div>

            {/* Light Sensor / NFC */}
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-1">
              <div
                className="h-4 w-4 rounded-full border-2 transition-colors duration-500"
                style={{
                  borderColor: isRedAlert
                    ? "rgba(224,101,91,0.9)"
                    : "rgba(100,100,120,0.3)",
                  backgroundColor: isRedAlert
                    ? "rgba(224,101,91,0.35)"
                    : "transparent",
                  boxShadow: isRedAlert
                    ? "0 0 12px rgba(224,101,91,0.6)"
                    : "none",
                }}
              />
              <span className="text-[8px] font-bold text-base-content/40">LIGHT SENSOR</span>
              <span className="text-[7px] text-base-content/30">
                {isRedAlert
                  ? "⚠ PHONE OUT!"
                  : info.phonePickedUp
                  ? "⚠ SECOND SCREEN"
                  : "— MONITORING"}
              </span>
            </div>

            {/* Timer overlay */}
            {(info.timerRunning || simState === "session_complete") && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-2xl border border-base-300/60 bg-base-200/90 px-6 py-3 text-center backdrop-blur-sm">
                <p className="text-[10px] font-bold text-base-content/50">FOCUS TIMER</p>
                <p className="font-display text-3xl font-black tabular-nums text-primary">
                  {fmt(timer)}
                </p>
              </div>
            )}

            {/* Return countdown overlay */}
            {simState === "phone_return_countdown" && (
              <div className="absolute top-6 right-6 rounded-2xl border-2 border-accent bg-accent/20 px-4 py-2 text-center animate-pulse">
                <p className="text-[9px] font-bold text-accent">RETURN PHONE NOW</p>
                <p className="font-display text-2xl font-black tabular-nums text-accent">{returnCountdown}s</p>
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-6 right-6">
              <span
                className={
                  isRedAlert
                    ? "badge border-accent bg-accent/20 text-xs font-bold text-accent animate-pulse"
                    : info.lampState === "active"
                    ? "badge border-transparent bg-primary/20 text-xs font-bold text-primary"
                    : info.lampState === "passed"
                    ? "badge border-transparent bg-secondary/20 text-xs font-bold text-secondary"
                    : info.lampState === "failed"
                    ? "badge border-transparent bg-accent/20 text-xs font-bold text-accent"
                    : "badge border-transparent bg-base-300/60 text-xs font-bold text-base-content/50"
                }
              >
                {info.title}
              </span>
            </div>
          </div>

          {/* Narration */}
          <div className="rounded-2xl border border-base-300/60 bg-base-200/60 p-4 text-center">
            <p className="font-display text-base font-extrabold">{info.title}</p>
            <p className="mt-1 text-sm text-base-content/60">{info.subtitle}</p>
          </div>
        </section>

        {/* RIGHT: Control Panel + Timeline */}
        <section className="flex w-80 flex-col gap-4">
          {/* Story flow */}
          <div className="rounded-2xl border border-base-300/60 bg-base-200/60 p-4">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
              Scenario Controls
            </h2>
            <p className="mt-1 text-[10px] text-base-content/40">
              Click the next step. Each button advances the simulation.
            </p>

            <div className="mt-3 flex flex-col gap-1.5">
              {(() => {
                const scenarios: { label: string; action: Action; next: SimState[]; icon: string }[] = [
                  { label: "Student arrives", action: { type: "STUDENT_ARRIVES" }, next: ["idle"], icon: "👤" },
                  { label: "Opens app", action: { type: "OPEN_APP" }, next: ["student_arrives"], icon: "📱" },
                  { label: "Upload material + set goal", action: { type: "SET_GOAL" }, next: ["app_opened"], icon: "📝" },
                  { label: "Notify parent", action: { type: "NOTIFY_PARENT" }, next: ["goal_set"], icon: "📲" },
                  { label: "Parent approves ✓", action: { type: "APPROVE" }, next: ["parent_notified"], icon: "✅" },
                  { label: "Parent denies ✕", action: { type: "DENY" }, next: ["parent_notified"], icon: "❌" },
                  { label: "Dock phone", action: { type: "DOCK_PHONE" }, next: ["parent_approved"], icon: "🔌" },
                  { label: "Start focus timer", action: { type: "SESSION_COMPLETE" }, next: ["focus_active", "student_returns"], icon: "⏱" },
                  { label: "Student leaves desk", action: { type: "LEAVE_DESK" }, next: ["focus_active", "student_returns"], icon: "🚶" },
                  { label: "Student returns", action: { type: "RETURN_DESK" }, next: ["student_leaves"], icon: "🪑" },
                  { label: "Pick up phone (cheat!)", action: { type: "PICK_UP_PHONE" }, next: ["focus_active", "student_returns"], icon: "🚫" },
                  { label: "Return phone to dock", action: { type: "RETURN_PHONE" }, next: ["phone_picked_up"], icon: "📱" },
                  { label: "Timer reset (phone back)", action: { type: "PHONE_TIMEOUT" }, next: ["phone_picked_up", "phone_return_countdown"], icon: "✅" },
                  { label: "Start quiz", action: { type: "START_QUIZ" }, next: ["session_complete"], icon: "🧠" },
                  { label: "Pass quiz ✓", action: { type: "PASS_QUIZ" }, next: ["quiz_active"], icon: "🏆" },
                  { label: "Fail quiz ✕", action: { type: "FAIL_QUIZ" }, next: ["quiz_active"], icon: "😢" },
                  { label: "Release reward", action: { type: "RELEASE_REWARD" }, next: ["quiz_passed"], icon: "🎁" },
                  { label: "↺ Reset", action: { type: "RESET" }, next: ["reward_released", "parent_denied", "quiz_failed"], icon: "🔄" },
                ];

                return scenarios.map((s) => {
                  const available = s.next.includes(simState);
                  return (
                    <button
                      key={s.label}
                      onClick={() => handleAction(s.action)}
                      disabled={!available}
                      className={
                        available
                          ? "btn btn-sm h-9 w-full justify-start rounded-xl border-transparent bg-primary/15 text-xs font-bold text-primary hover:bg-primary/25"
                          : "btn btn-ghost btn-sm h-9 w-full justify-start rounded-xl text-xs text-base-content/25"
                      }
                    >
                      <span className="mr-2">{s.icon}</span>
                      {s.label}
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-1 flex-col rounded-2xl border border-base-300/60 bg-base-200/60 p-4">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-base-content/50">
              Timeline
            </h2>
            <div ref={timelineRef} className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
              {timeline.length === 0 ? (
                <p className="text-xs text-base-content/40">
                  No events yet. Click a scenario button to start.
                </p>
              ) : (
                timeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="shrink-0 font-mono text-base-content/30">{entry.time}</span>
                    <span className={`font-medium ${entry.color}`}>{entry.event}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
