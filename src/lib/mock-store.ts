export type StudentProfile = {
  name: string;
  grade: string;
  subject: string;
};

export type GoalStatus = "waiting" | "approved" | "denied";

export type Goal = {
  id: string;
  subject: string;
  topic: string;
  details: string;
  material: string;
  parentContact: string;
  status: GoalStatus;
  timerMinutes: number;
  createdAt: number;
};

export type SessionStatus = "locked" | "paused" | "failed" | "passed" | "approved" | "denied";

export type QuizRecord = {
  question: string;
  answer: string;
  correctAnswer: string;
  explanation: string;
  correct: boolean;
};

export type Session = {
  id: string;
  goalId: string;
  subject: string;
  topic: string;
  material: string;
  timerSeconds: number;
  remainingSeconds: number;
  status: SessionStatus;
  startedAt: number;
  finishedAt?: number;
  credits: number;
  quiz?: QuizRecord[];
  understood?: boolean;
  unclearConcepts?: string;
  summary?: string;
  summaryPassed?: boolean;
  quizPassed?: boolean;
  parentMessage?: string;
};

export type QuizState = {
  records: QuizRecord[];
  done: boolean;
};

const PROFILE_KEY = "aurafocus_profile";
const GOAL_KEY = "aurafocus_goal";
const SESSION_KEY = "aurafocus_session";
const HISTORY_KEY = "aurafocus_history";
const CREDITS_KEY = "aurafocus_credits";
const QUIZ_KEY = "aurafocus_quiz";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* Profile */
export function getProfile(): StudentProfile | null {
  return read<StudentProfile>(PROFILE_KEY);
}

export function saveProfile(profile: StudentProfile) {
  write(PROFILE_KEY, profile);
}

/* Goal */
export function getGoal(): Goal | null {
  return read<Goal>(GOAL_KEY);
}

export function saveGoal(goal: Goal) {
  write(GOAL_KEY, goal);
}

export function updateGoalStatus(goal: Goal, status: GoalStatus) {
  const next = { ...goal, status };
  write(GOAL_KEY, next);
  return next;
}

export function clearGoal() {
  window.localStorage.removeItem(GOAL_KEY);
}

/* Session */
export function getSession(): Session | null {
  return read<Session>(SESSION_KEY);
}

export function saveSession(session: Session) {
  write(SESSION_KEY, session);
}

export function finishSession(session: Session) {
  write(SESSION_KEY, session);
  const history = getHistory();
  history.unshift(session);
  write(HISTORY_KEY, history.slice(0, 50));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

/* History + credits */
export function getHistory(): Session[] {
  return read<Session[]>(HISTORY_KEY) ?? [];
}

export function getCredits(): number {
  return read<number>(CREDITS_KEY) ?? 0;
}

export function addCredits(amount: number): number {
  const total = getCredits() + amount;
  write(CREDITS_KEY, total);
  return total;
}

/* Quiz */
export function getQuiz(): QuizState | null {
  return read<QuizState>(QUIZ_KEY);
}

export function saveQuiz(state: QuizState) {
  write(QUIZ_KEY, state);
}

export function clearQuiz() {
  window.localStorage.removeItem(QUIZ_KEY);
}

export function clearAll() {
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem(GOAL_KEY);
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(HISTORY_KEY);
  window.localStorage.removeItem(CREDITS_KEY);
  window.localStorage.removeItem(QUIZ_KEY);
}