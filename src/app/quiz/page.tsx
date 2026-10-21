"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getSession,
  getQuiz,
  saveQuiz,
  finishSession,
  addCredits,
  type Session,
  type QuizRecord,
} from "@/lib/mock-store";
import { getQuizQuestions, type QuizQuestion } from "@/lib/questions";

const SECONDS = 15;

type QuizStep =
  | "understanding"
  | "unclear_concepts"
  | "summary"
  | "voice_quiz"
  | "scoring"
  | "done";

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const voice =
    voices.find((v) => /en[-_]/i.test(v.lang) && /female|google/i.test(v.name)) ||
    voices.find((v) => /en[-_]/i.test(v.lang)) ||
    voices[0];
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

function listenForAnswer(
  onResult: (text: string) => void,
  onEnd: () => void
): (() => void) | null {
  if (typeof window === "undefined") return null;
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-IN";

  recognition.onresult = (event: any) => {
    const transcript = event.results[0]?.[0]?.transcript || "";
    onResult(transcript);
  };
  recognition.onend = onEnd;
  recognition.onerror = () => onEnd();

  recognition.start();
  return () => {
    try { recognition.stop(); } catch {}
  };
}

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<QuizStep>("understanding");
  const [understood, setUnderstood] = useState<boolean | null>(null);
  const [unclearText, setUnclearText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [summaryHighlights, setSummaryHighlights] = useState("");
  const [summaryUnderstanding, setSummaryUnderstanding] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<QuizRecord[]>([]);
  const [seconds, setSeconds] = useState(SECONDS);
  const [listening, setListening] = useState(false);
  const [voiceAnswer, setVoiceAnswer] = useState("");
  const doneRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const session = getSession();

  useEffect(() => {
    if (!session || session.status === "passed" || session.status === "failed") {
      router.replace("/");
      return;
    }
    const saved = getQuiz();
    if (saved && saved.records.length > 0) {
      setRecords(saved.records);
      setIndex(saved.records.length);
      setQuestions(getQuizQuestions(session.subject, session.topic, session.material));
    } else {
      const qs = getQuizQuestions(session.subject, session.topic, session.material);
      setQuestions(qs);
    }
  }, [router]);

  const finish = useCallback(
    (correct: number, summaryOK: boolean) => {
      doneRef.current = true;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (!session) return;
      const quizPassed = correct >= 2;
      const passed = quizPassed && summaryOK;
      const credits = passed ? 10 : 0;
      if (credits > 0) addCredits(credits);

      let parentMsg = "";
      if (!passed && !quizPassed && !summaryOK) {
        parentMsg = "Your child did not pass the quiz and summary. Would you like to restart the session today or continue tomorrow?";
      } else if (!passed && !quizPassed) {
        parentMsg = "Your child did not pass the quiz. Review recommended before retrying.";
      } else if (!passed && !summaryOK) {
        parentMsg = "Your child's summary needs improvement. Please review the material together.";
      } else {
        parentMsg = "Great job! Your child passed the session.";
      }

      const final: Session = {
        ...session,
        status: passed ? "passed" : "failed",
        credits,
        finishedAt: Date.now(),
        quiz: records,
        understood: understood ?? true,
        unclearConcepts: unclearText || undefined,
        summary: `Summary: ${summaryText}\nKey Highlights: ${summaryHighlights}\nUnderstanding: ${summaryUnderstanding}`,
        summaryPassed: summaryOK,
        quizPassed,
        parentMessage: parentMsg,
      };
      finishSession(final);
      router.push(`/result?status=${passed ? "passed" : "failed"}`);
    },
    [session, records, understood, unclearText, summaryText, summaryHighlights, summaryUnderstanding, router]
  );

  useEffect(() => {
    if (questions.length === 0 || index >= questions.length) return;
    setSeconds(SECONDS);
    setVoiceAnswer("");
    const q = questions[index];
    speak(`Question ${index + 1}. ${q.q}`);
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          recordVoice(voiceAnswer || "No answer");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [index, questions]);

  function recordVoice(text: string) {
    if (doneRef.current) return;
    const q = questions[index];
    if (!q) return;
    const hasContent = text.trim().length > 5;
    const next: QuizRecord[] = [
      ...records,
      {
        question: q.q,
        answer: text,
        correctAnswer: q.sampleAnswer,
        explanation: q.explanation,
        correct: hasContent,
      },
    ];
    setRecords(next);
    saveQuiz({ records: next, done: false });
    setIndex(index + 1);
  }

  function startVoiceQuiz() {
    setQuestions(getQuizQuestions(session!.subject, session!.topic, session!.material));
    setIndex(0);
    setRecords([]);
    setStep("voice_quiz");
  }

  function handleUnderstanding(yes: boolean) {
    setUnderstood(yes);
    if (yes) {
      speak("Great! Now please write a summary of what you studied.");
      setStep("summary");
    } else {
      speak("Please tell us which concepts you found difficult.");
      setStep("unclear_concepts");
    }
  }

  function handleUnclearSubmit() {
    speak("Thank you. We will only ask questions from concepts you understood. Now please write a summary.");
    setStep("summary");
  }

  function handleSummarySubmit() {
    if (summaryText.trim().length < 20) {
      speak("Please write a longer summary with at least 20 characters.");
      return;
    }
    speak("Summary submitted. Now starting the voice quiz. Listen to each question and speak your answer.");
    startVoiceQuiz();
  }

  function startVoiceListening() {
    if (cleanupRef.current) cleanupRef.current();
    setListening(true);
    setVoiceAnswer("");
    const cleanup = listenForAnswer(
      (text) => {
        setVoiceAnswer(text);
        setListening(false);
      },
      () => {
        setListening(false);
        if (voiceAnswer.trim().length > 5) {
          recordVoice(voiceAnswer);
        } else {
          recordVoice("No answer");
        }
      }
    );
    cleanupRef.current = cleanup || null;
  }

  function leaveQuiz() {
    doneRef.current = true;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (cleanupRef.current) cleanupRef.current();
    if (!session) return;
    const final: Session = {
      ...session,
      status: "failed",
      credits: 0,
      finishedAt: Date.now(),
    };
    finishSession(final);
    router.push(`/result?status=failed&reason=left-quiz`);
  }

  const done = questions.length > 0 && index >= questions.length && records.length === questions.length;
  const correctCount = records.filter((r) => r.correct).length;

  useEffect(() => {
    if (done && !doneRef.current) {
      const summaryOK = summaryText.trim().length >= 20;
      const t = setTimeout(() => finish(correctCount, summaryOK), 1400);
      return () => clearTimeout(t);
    }
  }, [done]);

  if (!session) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-base-content/60">No active session.</p>
        <button onClick={() => router.push("/")} className="btn btn-primary rounded-full">Back home</button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="loading loading-dots loading-lg text-primary" />
        <p className="font-display text-lg font-extrabold">Checking your answers…</p>
      </div>
    );
  }

  if (step === "understanding") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <span className="font-display text-sm font-extrabold tracking-tight">Focus<span className="text-primary">Glow</span></span>
          <span className="badge border-primary/40 bg-primary/15 py-2.5 text-xs font-bold text-primary">Check-in</span>
        </header>
        <section className="mt-8 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-primary/30 bg-primary/10">
            <span className="text-5xl">🤔</span>
          </div>
          <h2 className="mt-6 font-display text-xl font-extrabold">Quick Check-in</h2>
          <p className="mt-3 text-sm text-base-content/60">
            Before we start the quiz, did you understand the concepts well?
          </p>
        </section>
        <section className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => { speak("Great! Let's write a summary."); handleUnderstanding(true); }}
            className="btn h-16 w-full rounded-2xl border border-secondary/40 bg-secondary/10 text-base font-bold normal-case text-secondary hover:bg-secondary/20"
          >
            Yes, I understood well
          </button>
          <button
            onClick={() => { speak("No problem. Tell us what was difficult."); handleUnderstanding(false); }}
            className="btn h-16 w-full rounded-2xl border border-accent/40 bg-accent/10 text-base font-bold normal-case text-accent hover:bg-accent/20"
          >
            No, some concepts were unclear
          </button>
        </section>
        <div className="mt-8 flex flex-1 flex-col justify-end">
          <button onClick={leaveQuiz} className="text-center text-xs text-base-content/40 hover:text-accent">
            Leave session (auto-fail)
          </button>
        </div>
      </div>
    );
  }

  if (step === "unclear_concepts") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <span className="font-display text-sm font-extrabold tracking-tight">Focus<span className="text-primary">Glow</span></span>
          <span className="badge border-accent/40 bg-accent/15 py-2.5 text-xs font-bold text-accent">Help needed</span>
        </header>
        <section className="mt-8 text-center">
          <h2 className="font-display text-xl font-extrabold">Which concepts were unclear?</h2>
          <p className="mt-3 text-sm text-base-content/60">
            Tell us what you found difficult. We will only ask questions from concepts you understood.
          </p>
        </section>
        <section className="mt-6 flex flex-col gap-3">
          <textarea
            value={unclearText}
            onChange={(e) => setUnclearText(e.target.value)}
            placeholder="E.g., I didn't understand photosynthesis properly..."
            rows={4}
            className="textarea w-full rounded-2xl border-base-300/60 bg-base-200/40 text-base-content/80 placeholder:text-base-content/30"
          />
          <p className="text-xs text-base-content/40">
            This will be sent to your parents so they can help you review.
          </p>
          <button
            onClick={handleUnclearSubmit}
            className="btn btn-primary h-14 w-full rounded-full text-sm font-extrabold"
          >
            Continue to Summary
          </button>
        </section>
        <div className="mt-8 flex flex-1 flex-col justify-end">
          <button onClick={leaveQuiz} className="text-center text-xs text-base-content/40 hover:text-accent">
            Leave session (auto-fail)
          </button>
        </div>
      </div>
    );
  }

  if (step === "summary") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <span className="font-display text-sm font-extrabold tracking-tight">Focus<span className="text-primary">Glow</span></span>
          <span className="badge border-secondary/40 bg-secondary/15 py-2.5 text-xs font-bold text-secondary">Summary</span>
        </header>
        <section className="mt-6">
          <h2 className="font-display text-lg font-extrabold">Write your summary</h2>
          <p className="mt-2 text-sm text-base-content/60">
            Write a summary, key highlights, and your understanding of what you studied.
          </p>
        </section>
        <section className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-base-content/50 uppercase">Summary</label>
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder="Write a brief summary of the chapter..."
              rows={3}
              className="textarea mt-1 w-full rounded-2xl border-base-300/60 bg-base-200/40 text-base-content/80 placeholder:text-base-content/30"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/50 uppercase">Key Highlights</label>
            <textarea
              value={summaryHighlights}
              onChange={(e) => setSummaryHighlights(e.target.value)}
              placeholder="List the key points you learned..."
              rows={3}
              className="textarea mt-1 w-full rounded-2xl border-base-300/60 bg-base-200/40 text-base-content/80 placeholder:text-base-content/30"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/50 uppercase">Your Understanding</label>
            <textarea
              value={summaryUnderstanding}
              onChange={(e) => setSummaryUnderstanding(e.target.value)}
              placeholder="How well do you understand this topic? What was easy or difficult?"
              rows={3}
              className="textarea mt-1 w-full rounded-2xl border-base-300/60 bg-base-200/40 text-base-content/80 placeholder:text-base-content/30"
            />
          </div>
          <button
            onClick={handleSummarySubmit}
            className="btn btn-primary h-14 w-full rounded-full text-sm font-extrabold"
          >
            Submit Summary & Start Quiz
          </button>
        </section>
        <div className="mt-6 flex flex-1 flex-col justify-end">
          <button onClick={leaveQuiz} className="text-center text-xs text-base-content/40 hover:text-accent">
            Leave session (auto-fail)
          </button>
        </div>
      </div>
    );
  }

  if (step === "voice_quiz") {
    const q = questions[index];
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <span className="font-display text-sm font-extrabold tracking-tight">Focus<span className="text-primary">Glow</span></span>
          <span className="badge border-primary/40 bg-primary/15 py-2.5 text-xs font-bold text-primary">
            Question {Math.min(index + 1, questions.length)} of {questions.length}
          </span>
        </header>
        <section className="mt-4 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-primary/30 bg-primary/10">
            <span className="font-display text-3xl font-black tabular-nums text-primary">{seconds}</span>
          </div>
          <p className="mt-2 text-xs text-base-content/40">Listen to the question and speak your answer</p>
        </section>
        {q && (
          <section className="mt-4 rounded-2xl border border-base-300/60 bg-base-200/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-lg font-extrabold leading-snug">{q.q}</p>
              <button
                onClick={() => speak(q.q)}
                aria-label="Read question aloud again"
                className="btn btn-ghost btn-circle h-10 w-10 shrink-0 rounded-full border border-base-300/60 text-base-content/60 hover:text-primary"
              >
                🔊
              </button>
            </div>
          </section>
        )}
        <section className="mt-6 flex flex-col items-center gap-4">
          {listening ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                <span className="text-3xl">🎙️</span>
              </div>
              <p className="text-sm font-bold text-primary">Listening...</p>
            </div>
          ) : voiceAnswer ? (
            <div className="w-full rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
              <p className="text-xs text-base-content/50 uppercase font-bold">Your answer:</p>
              <p className="mt-1 text-sm text-base-content/80">{voiceAnswer}</p>
              <button
                onClick={() => { setVoiceAnswer(""); startVoiceListening(); }}
                className="btn btn-ghost mt-2 text-xs"
              >
                Record again
              </button>
            </div>
          ) : (
            <button
              onClick={startVoiceListening}
              className="btn btn-primary h-16 w-full rounded-full text-base font-extrabold"
            >
              🎙️ Tap to Speak Answer
            </button>
          )}
        </section>
        <div className="mt-8 flex flex-1 flex-col justify-end">
          <button onClick={leaveQuiz} className="text-center text-xs text-base-content/40 hover:text-accent">
            Leave session (auto-fail)
          </button>
        </div>
      </div>
    );
  }

  return null;
}
