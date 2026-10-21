"use client";

import { useState, useEffect, useRef } from "react";

type Phase =
  | "intro" | "walking_in" | "sitting" | "app_open" | "goal_form" | "sending"
  | "parent_phone" | "approved" | "docked" | "studying" | "choice"
  | "standing_up" | "walking_away" | "returned" | "sitting_back"
  | "timer_done" | "understanding_check" | "unclear_concepts" | "summary_writing"
  | "quiz" | "quiz_exit" | "penalty"
  | "passed" | "reward" | "denied" | "cheat" | "sleeping" | "another_device";

const PHRASES: Record<Phase, { desk: string; badge: string; badgeColor: string }> = {
  intro:        { desk:"Empty desk — waiting for the student.",  badge:"AWAY",      badgeColor:"#9eb0c8" },
  walking_in:   { desk:"Student walks into the room.",           badge:"ENTERING",  badgeColor:"#ffb24c" },
  sitting:      { desk:"Student takes a seat. Sensors come online.",badge:"SEATED", badgeColor:"#ffb24c" },
  app_open:     { desk:"FocusGlow opens on the phone.",          badge:"APP OPEN",  badgeColor:"#62e6a5" },
  goal_form:    { desk:"Student sets today's study goal.",       badge:"SET GOAL",  badgeColor:"#62e6a5" },
  sending:      { desk:"Goal sent to parent's phone...",         badge:"SENDING",   badgeColor:"#ffb24c" },
  parent_phone: { desk:"Parent receives the request.",           badge:"PARENT",    badgeColor:"#62e6a5" },
  approved:     { desk:"Parent approved! Lamp turns green.",     badge:"APPROVED",  badgeColor:"#62e6a5" },
  denied:       { desk:"Parent denied. Lamp turns red.",         badge:"DENIED",    badgeColor:"#e88" },
  docked:       { desk:"Phone on dock. Apps locked.",            badge:"DOCKED",    badgeColor:"#62e6a5" },
  studying:     { desk:"Student is studying. Timer running.",    badge:"STUDYING",  badgeColor:"#62e6a5" },
  choice:       { desk:"What does the student do?",              badge:"STUDYING",  badgeColor:"#62e6a5" },
  standing_up:  { desk:"Student stands up from the desk.",       badge:"GETTING UP",badgeColor:"#e88" },
  walking_away: { desk:"Student leaves the focus zone.",         badge:"AWAY",      badgeColor:"#e88" },
  returned:     { desk:"Student returns to the desk.",           badge:"BACK",      badgeColor:"#62e6a5" },
  sitting_back: { desk:"Student sits back down. Timer resumes.", badge:"RESUMED",   badgeColor:"#62e6a5" },
  timer_done:   { desk:"Timer complete! Time for the quiz.",     badge:"QUIZ TIME", badgeColor:"#62e6a5" },
  understanding_check: { desk:"Checking understanding...", badge:"CHECK-IN", badgeColor:"#ffb24c" },
  unclear_concepts: { desk:"Student needs help with concepts.", badge:"HELP", badgeColor:"#e88" },
  summary_writing: { desk:"Student writing summary...", badge:"SUMMARY", badgeColor:"#62e6a5" },
  quiz:         { desk:"AI voice quiz — speak your answer.",  badge:"QUIZ",      badgeColor:"#62e6a5" },
  quiz_exit:    { desk:"Quiz exited! Penalty countdown...",      badge:"PENALTY",   badgeColor:"#e88" },
  penalty:      { desk:"Must study 10 min before retry.",        badge:"PENALTY",   badgeColor:"#e88" },
  passed:       { desk:"Quiz passed! Credits earned.",           badge:"PASSED",    badgeColor:"#62e6a5" },
  reward:       { desk:"Reward unlocked! Apps released.",        badge:"REWARD",    badgeColor:"#62e6a5" },
  cheat:        { desk:"Second device detected! Session void.",  badge:"⚠ CHEAT",   badgeColor:"#e88" },
  sleeping:     { desk:"Student appears to be sleeping!",        badge:"⚠ SLEEPING", badgeColor:"#e88" },
  another_device:{ desk:"Another device detected! Warning!",     badge:"⚠ DEVICE",  badgeColor:"#e88" },
};

const QUIZ = [
  "What is the value of pi?",
  "A triangle with equal sides is called ___",
  "₹200 book, 10% off — you pay ₹___",
];

export default function PresentationPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("Math — Chapter 4, Ex 1–10");
  const [timer, setTimer] = useState(1800);
  const [timerDuration, setTimerDuration] = useState(30);
  const [running, setRunning] = useState(false);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showLamp, setShowLamp] = useState(false);
  const [showLampDiagram, setShowLampDiagram] = useState(false);
  const [pageFlip, setPageFlip] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [unclearText, setUnclearText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flipRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const d = PHRASES[phase];
  const isStudying = phase === "studying" || phase === "choice";
  const isSeated = ["sitting","app_open","goal_form","sending","parent_phone","approved","docked","studying","choice","returned","sitting_back","timer_done","understanding_check","unclear_concepts","summary_writing","quiz","quiz_exit","penalty","passed","reward","sleeping","another_device"].includes(phase);
  const isWalkingIn = phase === "walking_in";
  const isStandingUp = phase === "standing_up";
  const isWalkingAway = phase === "walking_away";
  const isSittingBack = phase === "sitting_back";
  const isSleeping = phase === "sleeping";
  const isAnotherDevice = phase === "another_device";

  // Page flip animation during studying
  useEffect(() => {
    if (isStudying) {
      flipRef.current = setInterval(() => {
        setPageFlip(p => !p);
      }, 2000);
    }
    return () => { if (flipRef.current) clearInterval(flipRef.current); };
  }, [isStudying]);

  // Auto sequences
  useEffect(() => { if (phase === "intro") { const t = setTimeout(() => setPhase("walking_in"), 1500); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "walking_in") { const t = setTimeout(() => setPhase("sitting"), 2000); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "sitting") { const t = setTimeout(() => setPhase("app_open"), 1500); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "app_open") { const t = setTimeout(() => setPhase("goal_form"), 1500); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "sending") { const t = setTimeout(() => setPhase("parent_phone"), 2000); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "approved") { const t = setTimeout(() => setPhase("docked"), 1500); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "docked") { const t = setTimeout(() => setPhase("studying"), 1000); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "returned") { const t = setTimeout(() => setPhase("sitting_back"), 1000); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { if (phase === "sitting_back") { setRunning(true); const t = setTimeout(() => setPhase("choice"), 1500); return () => clearTimeout(t); } }, [phase]);

  // Sleep detection — REMOVED auto-trigger, now manual via demo button

  // Standing up animation
  useEffect(() => {
    if (phase === "standing_up") {
      const t = setTimeout(() => setPhase("walking_away"), 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Walking away animation
  useEffect(() => {
    if (phase === "walking_away") {
      const t = setTimeout(() => {
        clearInterval(tickRef.current!);
        setRunning(false);
        setPhase("choice");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Timer
  useEffect(() => {
    if (running && (phase === "choice" || phase === "studying" || phase === "penalty")) {
      tickRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) { clearInterval(tickRef.current!); setRunning(false); setPhase("timer_done"); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [running, phase]);

  // Quiz exit
  useEffect(() => {
    if (phase === "quiz_exit") {
      let count = 3;
      const iv = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(iv);
          setTimer(600);
          setPhase("penalty");
          setRunning(true);
        }
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [phase]);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const sendGoal = () => { if (!name.trim()) return; setPhase("sending"); };
  const accept = () => { setTimer(timerDuration * 60); setPhase("approved"); };
  const deny = () => { clearInterval(tickRef.current!); setRunning(false); setPhase("denied"); };
  const leave = () => { clearInterval(tickRef.current!); setRunning(false); setPhase("standing_up"); };
  const returnDesk = () => { setPhase("returned"); };
  const cheat = () => { clearInterval(tickRef.current!); setRunning(false); setPhase("cheat"); };
  const triggerSleep = () => { clearInterval(tickRef.current!); setRunning(false); setPhase("sleeping"); };
  const triggerDevice = () => { clearInterval(tickRef.current!); setRunning(false); setPhase("another_device"); };
  const handleUnderstandingYes = () => { setUnderstood(true); setPhase("summary_writing"); };
  const handleUnderstandingNo = () => { setUnderstood(false); setPhase("unclear_concepts"); };
  const handleUnclearSubmit = () => { setPhase("summary_writing"); };
  const handleSummarySubmit = () => { if (summaryText.trim().length > 10) { setPhase("quiz"); setQi(0); setScore(0); setAnswer(""); } };
  const startQuiz = () => { setPhase("quiz"); setQi(0); setScore(0); setAnswer(""); };
  const submitAnswer = () => { if (answer.trim().length >= 2) setScore(s => s + 1); setAnswer(""); if (qi < 2) setQi(qi + 1); else setPhase("passed"); };
  const exitQuiz = () => { clearInterval(tickRef.current!); setPhase("quiz_exit"); };
  const release = () => setPhase("reward");
  const reset = () => { clearInterval(tickRef.current!); clearInterval(flipRef.current!); setRunning(false); setPhase("intro"); setTimer(1800); setTimerDuration(30); setQi(0); setScore(0); setAnswer(""); setName(""); setPageFlip(false); setUnderstood(false); setUnclearText(""); setSummaryText(""); };

  // Character — walks in from left, sits on chair in front of the book
  const getCharLeft = () => {
    if (isWalkingIn) return "18%";
    if (isWalkingAway) return "-10%";
    if (isStandingUp) return "20%";
    if (isSeated || isSittingBack) return "20%";
    return "80%";
  };
  const getCharBottom = () => {
    if (isSeated || isSittingBack) return "50px";
    if (isStandingUp) return "50px";
    if (isWalkingAway) return "48px";
    if (isWalkingIn) return "140px";
    return "40px";
  };
  const getCharOpacity = () => phase === "intro" ? 0.15 : 1;
  const getCharScale = () => {
    if (isWalkingAway) return "1.0";
    if (isWalkingIn) return "1.2";
    return "1.4";
  };

  return (
    <div className="min-h-dvh bg-[#0a1220] text-[#eef5ff] flex flex-col">
      {/* Lamp Info Modal */}
      {showLamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowLamp(false)}>
          <div className="bg-[#111f33] border border-[#29415f] rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Focus Lamp</h2>
              <button onClick={() => setShowLamp(false)} className="text-[#9eb0c8] hover:text-white text-xl cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-[#9eb0c8] mb-4">Hover over the lamp on the desk to see component labels.</p>
            <h3 className="text-sm font-bold text-[#62e6a5] mb-2">Components</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-[#16304b] rounded-xl p-3"><strong>LED Panel</strong><p className="text-[10px] text-[#9eb0c8] mt-1">RGB LEDs for adaptive color signaling</p></div>
              <div className="bg-[#16304b] rounded-xl p-3"><strong>Diffuser Shade</strong><p className="text-[10px] text-[#9eb0c8] mt-1">Soft, eye-friendly light spread</p></div>
              <div className="bg-[#16304b] rounded-xl p-3"><strong>Smart Stem</strong><p className="text-[10px] text-[#9eb0c8] mt-1">Adjustable arm with touch controls</p></div>
              <div className="bg-[#16304b] rounded-xl p-3"><strong>NFC Dock Base</strong><p className="text-[10px] text-[#9eb0c8] mt-1">Anti-tip base with phone dock</p></div>
            </div>
            <h3 className="text-sm font-bold text-[#62e6a5] mb-2">Smart Features</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-[#16304b] rounded-xl p-3"><strong>Amber</strong> = focus · <strong className="text-[#62e6a5]">Green</strong> = approved · <strong className="text-[#e88]">Red</strong> = denied</div>
              <div className="bg-[#16304b] rounded-xl p-3"><strong>Ultrasonic sensor</strong> — presence detection, auto-pause on leave</div>
              <div className="bg-[#16304b] rounded-xl p-3"><strong>Light sensor</strong> — detects second screens (cheat detection)</div>
              <div className="bg-[#16304b] rounded-xl p-3"><strong>NFC dock</strong> — locks distracting apps</div>
            </div>
          </div>
        </div>
      )}

      {/* Lamp Diagram Modal */}
      {showLampDiagram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowLampDiagram(false)}>
          <div className="bg-[#111f33] border border-[#29415f] rounded-2xl p-8 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Lamp — Component Diagram</h2>
            <p className="text-xs text-[#9eb0c8] mt-1">All smart components on the FocusGlow desk</p>
              <button onClick={() => setShowLampDiagram(false)} className="text-[#9eb0c8] hover:text-white text-xl cursor-pointer">✕</button>
            </div>
            <div className="flex justify-center">
              <svg viewBox="-80 0 560 500" className="w-full max-w-[480px]" xmlns="http://www.w3.org/2000/svg" style={{overflow:"visible"}}>
                <defs><radialGradient id="glow" cx="50%" cy="30%" r="50%"><stop offset="0%" stopColor="#62e6a5" stopOpacity="0.3"/><stop offset="100%" stopColor="#62e6a5" stopOpacity="0"/></radialGradient></defs>
                <path d="M140 160 L60 350 L340 350 L260 160 Z" fill="url(#glow)" />
                <rect x="155" y="130" width="90" height="35" rx="6" fill="#16304b" stroke="#62e6a5" strokeWidth="2"/>
                <text x="200" y="152" textAnchor="middle" fill="#62e6a5" fontSize="11" fontWeight="bold">LED Panel</text>
                <line x1="200" y1="130" x2="200" y2="100" stroke="#62e6a5" strokeWidth="1.5" strokeDasharray="4"/>
                <text x="200" y="95" textAnchor="middle" fill="#62e6a5" fontSize="10" fontWeight="bold">1. RGB LEDs</text>
                <text x="200" y="82" textAnchor="middle" fill="#9eb0c8" fontSize="8">Adaptive color signaling</text>
                <path d="M120 165 Q120 200 145 200 L255 200 Q280 200 280 165 Z" fill="#ddd" stroke="#9eb0c8" strokeWidth="2"/>
                <text x="200" y="188" textAnchor="middle" fill="#333" fontSize="10" fontWeight="bold">Diffuser</text>
                <line x1="280" y1="182" x2="340" y2="182" stroke="#62e6a5" strokeWidth="1.5" strokeDasharray="4"/>
                <text x="345" y="178" fill="#62e6a5" fontSize="10" fontWeight="bold">2. Diffuser Shade</text>
                <text x="345" y="192" fill="#9eb0c8" fontSize="8">Soft light spread</text>
                <rect x="193" y="200" width="14" height="180" rx="7" fill="#34475d" stroke="#62e6a5" strokeWidth="1.5"/>
                <circle cx="200" cy="290" r="4" fill="#62e6a5" opacity="0.6"/>
                <text x="200" y="310" textAnchor="middle" fill="#62e6a5" fontSize="8">touch</text>
                <line x1="207" y1="290" x2="340" y2="290" stroke="#62e6a5" strokeWidth="1.5" strokeDasharray="4"/>
                <text x="345" y="286" fill="#62e6a5" fontSize="10" fontWeight="bold">3. Smart Stem</text>
                <text x="345" y="300" fill="#9eb0c8" fontSize="8">Adjustable arm + touch</text>
                <ellipse cx="200" cy="400" rx="80" ry="16" fill="#34475d" stroke="#62e6a5" strokeWidth="1.5"/>
                <ellipse cx="200" cy="395" rx="80" ry="16" fill="#3d5268"/>
                <rect x="170" y="385" width="60" height="8" rx="4" fill="#18283d" stroke="#62e6a5" strokeWidth="1"/>
                <text x="200" y="392" textAnchor="middle" fill="#62e6a5" fontSize="7" fontWeight="bold">NFC</text>
                <line x1="280" y1="395" x2="340" y2="395" stroke="#62e6a5" strokeWidth="1.5" strokeDasharray="4"/>
                <text x="345" y="391" fill="#62e6a5" fontSize="10" fontWeight="bold">4. NFC Dock Base</text>
                <text x="345" y="405" fill="#9eb0c8" fontSize="8">Locks apps on dock</text>
                <circle cx="120" cy="350" r="12" fill="#16304b" stroke="#ffb24c" strokeWidth="2"/>
                <text x="120" y="354" textAnchor="middle" fill="#ffb24c" fontSize="7" fontWeight="bold">US</text>
                <line x1="120" y1="338" x2="50" y2="338" stroke="#ffb24c" strokeWidth="1.5" strokeDasharray="4"/>
                <text x="45" y="334" fill="#ffb24c" fontSize="10" fontWeight="bold" textAnchor="end">5. Ultrasonic</text>
                <text x="45" y="348" fill="#9eb0c8" fontSize="8" textAnchor="end">Presence detection</text>
                <circle cx="280" cy="350" r="12" fill="#16304b" stroke="#e88" strokeWidth="2"/>
                <text x="280" y="354" textAnchor="middle" fill="#e88" fontSize="7" fontWeight="bold">LS</text>
                <line x1="280" y1="338" x2="350" y2="338" stroke="#e88" strokeWidth="1.5" strokeDasharray="4"/>
                <text x="355" y="334" fill="#e88" fontSize="10" fontWeight="bold">6. Light Sensor</text>
                <text x="355" y="348" fill="#9eb0c8" fontSize="8">Cheat detection</text>

                {/* Desk Mat */}
                <rect x="50" y="430" width="300" height="12" rx="4" fill="#1a3a2a" stroke="#62e6a5" strokeWidth="1.5" strokeDasharray="4"/>
                <text x="200" y="440" textAnchor="middle" fill="#62e6a5" fontSize="9" fontWeight="bold">7. Smart Desk Mat</text>
                <text x="200" y="458" textAnchor="middle" fill="#9eb0c8" fontSize="8">Page flip detection · Presence sensing</text>

                {/* NFC Sensor */}
                <circle cx="50" cy="436" r="8" fill="#16304b" stroke="#62e6a5" strokeWidth="1.5"/>
                <text x="50" y="440" textAnchor="middle" fill="#62e6a5" fontSize="6" fontWeight="bold">NFC</text>
                <line x1="50" y1="428" x2="50" y2="415" stroke="#62e6a5" strokeWidth="1" strokeDasharray="3"/>
                <text x="55" y="413" fill="#62e6a5" fontSize="8" fontWeight="bold">8. NFC Sensor</text>
                <text x="55" y="424" fill="#9eb0c8" fontSize="7">Unauthorized device detection</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-4 lg:px-6 py-3 border-b border-[#29415f] shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#16304b] flex items-center justify-center">
            <span className="h-3 w-3 rounded-full bg-[#62e6a5] shadow-[0_0_10px_rgba(98,230,165,0.9)]" />
          </div>
          <div>
            <h1 className="text-sm font-bold m-0">FocusGlow — Live Demo</h1>
            <p className="text-[9px] text-[#9eb0c8]">Watch the full flow happen automatically</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLampDiagram(true)} className="px-3 py-1.5 rounded-lg bg-[#16304b] text-[#ffb24c] text-[10px] font-bold cursor-pointer hover:brightness-110">Lamp Diagram</button>
          <button onClick={() => setShowLamp(true)} className="px-3 py-1.5 rounded-lg bg-[#16304b] text-[#62e6a5] text-[10px] font-bold cursor-pointer hover:brightness-110">Lamp Info</button>
          <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold" style={{background:`${d.badgeColor}22`, color:d.badgeColor}}>{d.badge}</span>
          <button onClick={reset} className="px-3 py-1.5 rounded-lg bg-[#24415f] text-white text-[10px] font-bold cursor-pointer hover:brightness-110">↺</button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* LEFT: FULL SCENE — border around everything */}
        <div className="flex-1 relative border-b lg:border-b-0 lg:border-r border-[#29415f] min-h-[500px] lg:min-h-0 overflow-visible m-2 rounded-xl border border-[#29415f]" style={{background:"linear-gradient(180deg, #0f1f35 0%, #132238 60%, #0a1525 100%)"}}>

          {/* ===== DESK — full width, moved up ===== */}
          <div className="absolute left-[3%] right-[3%] bottom-[80px] h-[16px] bg-[#8b5b3d] rounded-lg shadow-xl z-[3]" />
          <div className="absolute bottom-0 left-[8%] w-3 h-[36px] bg-[#4d3528] rounded-b z-[2]" />
          <div className="absolute bottom-0 right-[8%] w-3 h-[36px] bg-[#4d3528] rounded-b z-[2]" />
          <div className="absolute left-[3%] right-[3%] bottom-[80px] h-[3px] bg-[#6f4e3a] rounded-b z-[3]" />

          {/* ===== 7. SMART DESK MAT — center of desk ===== */}
          <div className="absolute left-[28%] right-[38%] bottom-[92px] rounded-lg z-[4] transition-all duration-500" style={{
            height: "14px",
            background: isStudying ? "linear-gradient(90deg, #0a3a2a, #1a5a3a, #0a3a2a)" : "#0e2030",
            border: isStudying ? "2px dashed #62e6a5" : "2px dashed #2a4060",
            boxShadow: isStudying ? "0 0 30px rgba(98,230,165,0.3)" : "none"
          }}>
            {isStudying && (
              <div className="absolute top-[3px] left-[3%] right-[3%] flex justify-between">
                {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className="relative">
                    <div className="h-[4px] w-[4px] rounded-full bg-[#62e6a5] animate-pulse" style={{animationDelay:`${i*0.08}s`}} />
                    {pageFlip && i % 2 === 0 && (
                      <div className="absolute -top-1 -left-1 h-[8px] w-[8px] rounded-full border border-[#62e6a5] animate-ping opacity-60" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== BOOK + PENCIL on mat ===== */}
          {(isStudying || phase === "timer_done" || phase === "quiz" || phase === "quiz_exit" || phase === "penalty" || phase === "passed" || phase === "reward" || isSleeping || isAnotherDevice) && (
            <div className="absolute left-[32%] bottom-[104px] z-[6]">
              <div className={`w-[70px] h-[48px] rounded-sm shadow-lg transition-transform duration-300 ${pageFlip ? "rotate-[-2deg]" : "rotate-[2deg]"}`} style={{background:"linear-gradient(135deg, #f5f0e0, #e8e0c8)", border:"1px solid #d4c8a0"}}>
                <div className="absolute top-2 left-2 right-2 space-y-1">
                  <div className="h-[2px] bg-[#bbb] rounded" style={{width:"80%"}} />
                  <div className="h-[2px] bg-[#ccc] rounded" style={{width:"60%"}} />
                  <div className="h-[2px] bg-[#bbb] rounded" style={{width:"70%"}} />
                </div>
                <div className={`absolute top-0 right-0 w-[18px] h-full bg-gradient-to-l from-[#e8e0c8] to-transparent transition-all duration-500 ${pageFlip ? "opacity-100" : "opacity-0"}`} />
              </div>
            </div>
          )}
          {isStudying && (
            <div className="absolute left-[28%] bottom-[103px] z-[6] rotate-[-30deg]">
              <div className="w-[50px] h-[3px] bg-[#ffb24c] rounded-full shadow" />
              <div className="absolute right-0 top-0 w-[6px] h-[3px] bg-[#333] rounded-r" />
            </div>
          )}

          {/* ===== CHAIR — in front of book ===== */}
          <div className="absolute left-[19%] bottom-[40px] w-[90px] h-[110px] z-[2]" style={{opacity: isSeated || isStandingUp ? 1 : 0.3}}>
            <div className="absolute bottom-0 w-full h-5 bg-[#34475d] rounded-xl" />
            <div className="absolute left-2 bottom-[5px] w-[78px] h-[98px] bg-[#34475d] rounded-t-[30px]" />
          </div>

          {/* ===== STUDENT — sits on chair, LEFT side ===== */}
          <div className="absolute transition-all z-[5]" style={{
            left: getCharLeft(),
            bottom: getCharBottom(),
            opacity: getCharOpacity(),
            transform: `scale(${getCharScale()})`,
            transition: isWalkingAway ? "all 2.5s cubic-bezier(0.4, 0, 0.2, 1)" : "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <div className="relative w-[50px] h-[100px]">
              {/* Head */}
              <div className="absolute left-[12px] top-[0px] w-[26px] h-[26px] bg-[#e8c49a] rounded-full z-[2]">
                {/* Bangs covering face */}
                <div className="absolute top-[-2px] left-[-3px] w-[32px] h-[16px] bg-[#1a0a00] rounded-b-[14px] z-[3]" />
                <div className="absolute top-[4px] left-[-2px] w-[30px] h-[10px] bg-[#2a1500] rounded-b-[12px] z-[3]" />
                {/* Eyes peeking under bangs */}
                <div className={`absolute rounded-full bg-[#1a1a2a] ${isSleeping ? "top-[12px] left-[4px] w-[6px] h-[1px]" : "top-[10px] left-[5px] w-[5px] h-[5px] z-[4]"}`} />
                <div className={`absolute rounded-full bg-[#1a1a2a] ${isSleeping ? "top-[12px] right-[4px] w-[6px] h-[1px]" : "top-[10px] right-[5px] w-[5px] h-[5px] z-[4]"}`} />
                {/* Mouth */}
                <div className={`absolute bottom-[4px] left-[9px] w-[8px] h-[3px] rounded-b-full z-[4] ${isSleeping ? "bg-[#1a1a2a]" : "bg-[#c47a5a]"}`} />
              </div>
              {/* Long hair sides */}
              <div className="absolute left-[8px] top-[8px] w-[5px] h-[30px] bg-[#1a0a00] rounded-full z-[1]" />
              <div className="absolute right-[8px] top-[8px] w-[5px] h-[30px] bg-[#1a0a00] rounded-full z-[1]" />
              {/* Ponytail from back */}
              <div className="absolute left-[32px] top-[4px] z-[0]">
                <div className="w-[4px] h-[24px] bg-[#1a0a00] rounded-full" />
                <div className="absolute top-[20px] left-[-2px] w-[8px] h-[12px] bg-[#1a0a00] rounded-full" />
                <div className="absolute top-[18px] left-[-1px] w-[6px] h-[2px] bg-[#ff6b9d] rounded-full" />
              </div>
              {/* Hoodie */}
              <div className="absolute left-[10px] top-[24px] w-[30px] h-[36px] bg-[#5b4a8a] rounded-t-lg z-[1]">
                {/* Hoodie pocket */}
                <div className="absolute bottom-[6px] left-[6px] right-[6px] h-[8px] bg-[#4a3a7a] rounded-md" />
                {/* Hoodie string */}
                <div className="absolute top-[2px] left-[12px] w-[1px] h-[6px] bg-[#ddd]" />
                <div className="absolute top-[2px] right-[12px] w-[1px] h-[6px] bg-[#ddd]" />
              </div>
              {/* Hood */}
              <div className="absolute left-[8px] top-[20px] w-[34px] h-[10px] bg-[#4a3a7a] rounded-t-full z-[0]" />
              {/* Arms in hoodie sleeves */}
              <div className="absolute top-[26px] left-[4px] w-[9px] h-[22px] bg-[#5b4a8a] rounded-full transition-all duration-300 origin-top z-[2]" style={{transform: isStudying ? "rotate(35deg)" : isSleeping ? "rotate(15deg)" : "rotate(5deg)"}}>
                <div className="absolute bottom-0 left-[1px] w-[7px] h-[6px] bg-[#e8c49a] rounded-full" />
              </div>
              <div className="absolute top-[26px] right-[4px] w-[9px] h-[22px] bg-[#5b4a8a] rounded-full transition-all duration-300 origin-top z-[2]" style={{transform: isStudying ? "rotate(-35deg)" : isSleeping ? "rotate(-15deg)" : "rotate(-5deg)"}}>
                <div className="absolute bottom-0 right-[1px] w-[7px] h-[6px] bg-[#e8c49a] rounded-full" />
              </div>
              {/* Skirt */}
              <div className="absolute left-[8px] top-[58px] w-[34px] h-[14px] bg-[#2a2a4a] rounded-b-lg z-[1]" style={{clipPath:"polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)"}} />
              {/* Legs — visible below skirt when standing/walking */}
              <div className="absolute left-[16px] top-[70px] w-[6px] h-[16px] bg-[#e8c49a] rounded-b transition-all z-[0]" style={{opacity: isSeated ? 0 : 1}} />
              <div className="absolute right-[16px] top-[70px] w-[6px] h-[16px] bg-[#e8c49a] rounded-b transition-all z-[0]" style={{opacity: isSeated ? 0 : 1}} />
              {/* Shoes */}
              <div className={`absolute left-[13px] top-[84px] w-[11px] h-[5px] bg-[#1a1a2a] rounded-b-lg transition-all z-[0] ${isWalkingAway || isWalkingIn ? "translate-y-[-2px]" : ""}`} style={{opacity: isSeated ? 0 : 1}} />
              <div className={`absolute right-[13px] top-[84px] w-[11px] h-[5px] bg-[#1a1a2a] rounded-b-lg transition-all z-[0] ${isWalkingAway || isWalkingIn ? "translate-y-[2px]" : ""}`} style={{opacity: isSeated ? 0 : 1}} />
              {/* Sitting legs */}
              {isSeated && (
                <>
                  <div className="absolute left-[14px] top-[68px] w-[7px] h-[14px] bg-[#e8c49a] rounded-b z-[0]" style={{transform:"rotate(8deg)"}} />
                  <div className="absolute right-[14px] top-[68px] w-[7px] h-[14px] bg-[#e8c49a] rounded-b z-[0]" style={{transform:"rotate(-8deg)"}} />
                  <div className="absolute left-[11px] top-[80px] w-[10px] h-[5px] bg-[#1a1a2a] rounded-b-lg z-[0]" />
                  <div className="absolute right-[11px] top-[80px] w-[10px] h-[5px] bg-[#1a1a2a] rounded-b-lg z-[0]" />
                </>
              )}
              {isSleeping && <div className="absolute -top-3 -right-3 text-[10px] font-black text-[#e88] animate-bounce z-[3]">z z z</div>}
              {isAnotherDevice && <div className="absolute top-[20px] -right-[14px] w-[14px] h-[22px] bg-[#3a5a8a] rounded-sm border border-[#6a8ab0] shadow-lg flex items-center justify-center z-[3]"><div className="w-[8px] h-[6px] bg-[#8ab0d0] rounded-[1px]" /></div>}
            </div>
          </div>

          {/* ===== SLEEPING + CHEAT alerts ===== */}
          {(phase === "cheat" || isAnotherDevice) && (
            <div className="absolute left-[22%] bottom-[150px] z-20 pointer-events-none">
              <div className="text-[14px] font-black text-[#e88] animate-bounce whitespace-nowrap" style={{textShadow:"0 0 10px rgba(238,136,136,0.8)"}}>
                {isAnotherDevice ? "⚠ ANOTHER DEVICE DETECTED!" : "BEEP! BEEP!"}
              </div>
              <div className="mt-1 bg-[#a43f4b] text-white text-[11px] font-bold px-4 py-2 rounded-lg shadow-lg animate-bounce whitespace-nowrap">📲 Parent Notified!</div>
            </div>
          )}
          {isSleeping && (
            <div className="absolute left-[22%] bottom-[150px] z-20 pointer-events-none">
              <div className="text-[14px] font-black text-[#e88] animate-bounce whitespace-nowrap" style={{textShadow:"0 0 10px rgba(238,136,136,0.8)"}}>💤 Student sleeping!</div>
              <div className="mt-1 bg-[#a43f4b] text-white text-[11px] font-bold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">📲 Alert sent to parent!</div>
            </div>
          )}

          {/* ====================================================== */}
          {/* ===== LAMP DIAGRAM — SMALL BORDERED BOX ===== */}
          {/* ====================================================== */}
          <div className="absolute bottom-[100px] left-[48%] right-[3%] z-10 border border-[#29415f]/60 rounded-lg bg-[#0c1828]/80 p-2 overflow-visible" style={{height:"65%"}}>

            {/* Title */}
            <div className="text-center mb-1 shrink-0">
              <span className="text-[9px] font-extrabold text-[#62e6a5] tracking-wide">Focus Lamp &amp; Sensors</span>
            </div>

            {/* Lamp area */}
            <div className="flex-1 relative min-h-0" style={{height:"calc(100% - 20px)"}}>

              {/* Glow */}
              <div className="absolute top-[20px] left-[25%] right-[25%] bottom-[15%] rounded-b-[50%] pointer-events-none transition-all duration-700" style={{
                background: ["approved","docked","studying","choice","returned","sitting_back","timer_done","quiz","passed","reward"].includes(phase) ? "radial-gradient(ellipse at 50% 0%, rgba(98,230,165,0.3), transparent 70%)" :
                            ["denied","cheat","sleeping","another_device"].includes(phase) ? "radial-gradient(ellipse at 50% 0%, rgba(238,136,136,0.3), transparent 70%)" :
                            ["sitting","app_open","goal_form","sending","parent_phone"].includes(phase) ? "radial-gradient(ellipse at 50% 0%, rgba(255,178,76,0.3), transparent 70%)" : "none",
                filter:"blur(8px)"
              }} />

              {/* 1. LED Panel */}
              <div className="absolute top-0 left-[22%] right-[22%] h-[22px] rounded-b-[12px] transition-all duration-500" style={{
                background: ["approved","docked","studying","choice","returned","sitting_back","timer_done","quiz","passed","reward"].includes(phase) ? "linear-gradient(180deg,#3d5a50,#2a4a3d)" :
                            ["denied","cheat","sleeping","another_device"].includes(phase) ? "linear-gradient(180deg,#5a3d3d,#4a2a2a)" :
                            ["sitting","app_open","goal_form","sending","parent_phone"].includes(phase) ? "linear-gradient(180deg,#4a5280,#3a4270)" : "linear-gradient(180deg,#3c4363,#2c3353)"
              }}>
                <div className="absolute bottom-0 left-[15%] right-[15%] h-[5px] rounded-b-full transition-all duration-500" style={{
                  background: ["approved","docked","studying","choice","returned","sitting_back","timer_done","quiz","passed","reward"].includes(phase) ? "#62e6a5" :
                              ["denied","cheat","sleeping","another_device"].includes(phase) ? "#e88" :
                              ["sitting","app_open","goal_form","sending","parent_phone"].includes(phase) ? "#ffd9a0" : "#5a5a6a",
                  boxShadow: ["approved","docked","studying","choice","returned","sitting_back","timer_done","quiz","passed","reward"].includes(phase) ? "0 0 15px rgba(98,230,165,0.8)" :
                             ["denied","cheat","sleeping","another_device"].includes(phase) ? "0 0 15px rgba(238,136,136,0.8)" :
                             ["sitting","app_open","goal_form","sending","parent_phone"].includes(phase) ? "0 0 15px rgba(255,178,76,0.8)" : "none"
                }} />
              </div>

              {/* 2. Diffuser */}
              <div className="absolute top-[22px] left-[30%] right-[30%] h-[6px] rounded-b-[10px]" style={{
                background: ["approved","docked","studying","choice","returned","sitting_back","timer_done","quiz","passed","reward"].includes(phase) ? "linear-gradient(180deg,#4a6a5a,#3d5a50)" :
                            ["denied","cheat","sleeping","another_device"].includes(phase) ? "linear-gradient(180deg,#6a4a4a,#5a3d3d)" :
                            ["sitting","app_open","goal_form","sending","parent_phone"].includes(phase) ? "linear-gradient(180deg,#5a6290,#4a5280)" : "linear-gradient(180deg,#4c5373,#3c4363)"
              }} />

              {/* 3. Stem */}
              <div className="absolute top-[26px] left-1/2 -translate-x-1/2 bottom-[28px] w-[5px] bg-gradient-to-b from-[#34475d] to-[#26384c] rounded-full" />
              {/* Touch dot */}
              <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full bg-[#2a3a50] border border-[#4a6080]" />

              {/* 4. NFC Dock */}
              <div className="absolute bottom-0 left-[18%] right-[18%]">
                <div className="h-[12px] rounded-t-md bg-gradient-to-r from-[#2a4a3d] via-[#3d5a50] to-[#2a4a3d] border border-[#62e6a5]/50 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-[#62e6a5]">4. NFC Dock Base</span>
                </div>
              </div>

              {/* === LABELS INSIDE === */}

              {/* 1. RGB LEDs — top left */}
              <div className="absolute top-[-16px] left-[-4px]">
                <span className="text-[8px] font-bold text-[#62e6a5] whitespace-nowrap">1. RGB LED Panel</span>
              </div>

              {/* 2. Diffuser — right of diffuser */}
              <div className="absolute top-[18px] right-[-4px] flex items-center gap-[2px]">
                <div className="w-[8px] h-0 border-t border-dashed border-[#9eb0c8]" />
                <div className="text-[8px] font-bold text-white whitespace-nowrap">2. Diffuser</div>
              </div>

              {/* 3. Stem — right side */}
              <div className="absolute top-[50%] right-[-4px] flex items-center gap-[2px]" style={{transform:"translateY(-50%)"}}>
                <div className="w-[8px] h-0 border-t border-dashed border-[#9eb0c8]" />
                <div className="text-[8px] font-bold text-white whitespace-nowrap">3. Smart Stem</div>
              </div>

              {/* 5. Heat Sensor — left */}
              <div className="absolute top-[35%] left-[-4px] -translate-y-1/2 flex items-center gap-[2px]">
                <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center shrink-0" style={{
                  background: isSleeping ? "#3a1a1a" : "#16304b",
                  border: `1.5px solid ${isSleeping ? "#e88" : "#ffb24c"}`
                }}><span className="text-[6px] font-bold text-[#ffb24c]">HS</span></div>
                <div className="w-[6px] h-0 border-t border-dashed border-[#ffb24c] shrink-0" />
                <div className="text-[7px] font-bold text-[#ffb24c] whitespace-nowrap">5. Heat Sensor</div>
              </div>

              {/* 8. NFC Sensor — left lower */}
              <div className="absolute top-[60%] left-[-4px] -translate-y-1/2 flex items-center gap-[2px]">
                <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center shrink-0" style={{
                  background: (phase === "cheat" || isAnotherDevice) ? "#3a1a1a" : "#16304b",
                  border: `1.5px solid ${(phase === "cheat" || isAnotherDevice) ? "#e88" : "#62e6a5"}`
                }}><span className="text-[6px] font-bold text-[#62e6a5]">NFC</span></div>
                <div className="w-[6px] h-0 border-t border-dashed border-[#62e6a5] shrink-0" />
                <div className="text-[7px] font-bold text-[#62e6a5] whitespace-nowrap">8. NFC Sensor</div>
              </div>

              {/* 6. Light Sensor — right */}
              <div className="absolute top-[35%] right-[-4px] -translate-y-1/2 flex items-center gap-[2px] flex-row-reverse">
                <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center shrink-0" style={{
                  background: (phase === "cheat" || isAnotherDevice) ? "#3a1a1a" : "#16304b",
                  border: "1.5px solid #e88"
                }}><span className="text-[6px] font-bold text-[#e88]">LS</span></div>
                <div className="w-[6px] h-0 border-t border-dashed border-[#e88] shrink-0" />
                <div className="text-[7px] font-bold text-[#e88] whitespace-nowrap">6. Light Sensor</div>
              </div>

            </div>
          </div>

          {/* Mat label */}
          <div className="absolute left-[28%] bottom-[68px] z-10 text-center">
            <span className="text-[11px] font-bold text-[#62e6a5]">7. Smart Desk Mat</span>
            <span className="block text-[8px] text-[#9eb0c8]">Page flip · Presence sensing</span>
          </div>

          {/* Scene label */}
          <div className="absolute left-3 bottom-3 right-3 bg-[#091525dd] px-3 py-2 rounded-lg text-center backdrop-blur-sm z-10">
            <p className="text-[11px] font-bold">{d.desk}</p>
          </div>
        </div>

        {/* RIGHT: Phone + Controls */}
        <div className="w-full lg:w-[420px] flex flex-col bg-[#0e1a2e] shrink-0">
          <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
            <div className="relative w-[240px] rounded-[2rem] border-4 border-[#34475d] bg-[#18283d] shadow-2xl overflow-hidden" style={{aspectRatio:"9/16"}}>
              <div className="absolute inset-0 p-3">
                {phase === "intro" && <div className="flex h-full items-center justify-center text-[#4a6080] text-sm">Phone on the desk</div>}
                {phase === "walking_in" && <div className="flex h-full items-center justify-center text-[#4a6080] text-sm">Phone on the desk</div>}

                {phase === "app_open" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center shadow-lg">
                      <span className="text-2xl">☀️</span>
                    </div>
                    <span className="text-base font-extrabold text-[#62e6a5]">FocusGlow</span>
                    <span className="text-[10px] text-[#9eb0c8]">Your focus companion</span>
                    <div className="mt-4 space-y-1.5 w-full px-2">
                      <div className="h-2 w-full rounded-full bg-[#16304b]" />
                      <div className="h-2 w-3/4 rounded-full bg-[#16304b]" />
                    </div>
                    <button className="mt-4 px-6 py-2 rounded-full bg-[#19865c] text-white text-[11px] font-bold">Get Started</button>
                  </div>
                )}

                {phase === "goal_form" && (
                  <div className="flex h-full flex-col gap-2 p-3">
                    <span className="text-xs font-extrabold text-[#62e6a5]">Set Today&apos;s Goal</span>
                    <div className="rounded-lg border border-[#29415f] bg-[#0b1728] p-2">
                      <label className="text-[8px] text-[#9eb0c8] font-bold uppercase">Your Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="w-full bg-transparent text-white text-[10px] mt-0.5 outline-none placeholder:text-[#4a6080]" />
                    </div>
                    <div className="rounded-lg border border-[#29415f] bg-[#0b1728] p-2">
                      <label className="text-[8px] text-[#9eb0c8] font-bold uppercase">Subject</label>
                      <select className="w-full bg-[#0b1728] text-white text-[10px] mt-0.5 outline-none rounded px-1 py-0.5" style={{colorScheme:"dark"}}>
                        <option value="" className="bg-[#0b1728] text-[#9eb0c8]">Select subject</option>
                        <option value="Maths" className="bg-[#0b1728] text-white">Maths</option>
                        <option value="Science" className="bg-[#0b1728] text-white">Science</option>
                        <option value="English" className="bg-[#0b1728] text-white">English</option>
                        <option value="Hindi" className="bg-[#0b1728] text-white">Hindi</option>
                        <option value="History" className="bg-[#0b1728] text-white">History</option>
                      </select>
                    </div>
                    <div className="rounded-lg border border-[#29415f] bg-[#0b1728] p-2">
                      <label className="text-[8px] text-[#9eb0c8] font-bold uppercase">Topic</label>
                      <input value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-transparent text-white text-[10px] mt-0.5 outline-none" />
                    </div>
                    <div className="rounded-lg border border-[#29415f] bg-[#0b1728] p-2">
                      <label className="text-[8px] text-[#9eb0c8] font-bold uppercase">Parent&apos;s Phone</label>
                      <input value={""} readOnly placeholder="Pre-filled by parent" className="w-full bg-transparent text-[#4a6080] text-[10px] mt-0.5 outline-none" />
                    </div>
                    <button onClick={sendGoal} disabled={!name.trim()} className={`mt-auto py-2 rounded-full text-[10px] font-extrabold transition-all ${name.trim() ? "bg-[#19865c] text-white cursor-pointer" : "bg-[#16304b] text-[#4a6080] cursor-not-allowed"}`}>
                      Send to Parent&apos;s Phone
                    </button>
                  </div>
                )}

                {phase === "sending" && (
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#16304b] animate-pulse flex items-center justify-center text-xl">📲</div>
                    <span className="text-xs font-bold text-[#62e6a5]">Sending...</span>
                  </div>
                )}

                {phase === "parent_phone" && (
                  <div className="flex h-full flex-col gap-2 p-3">
                    <span className="text-xs font-extrabold text-[#62e6a5]">Parent Review</span>
                    <div className="rounded-lg border border-[#19865c]/30 bg-[#19865c]/10 p-2.5">
                      <span className="text-[10px] font-bold">{name || "Student"}&apos;s request:</span>
                      <div className="mt-1 space-y-0.5">
                        <span className="text-[9px] text-[#9eb0c8] block">Subject: <strong className="text-white">{goal.split("—")[0]?.trim() || "Maths"}</strong></span>
                        <span className="text-[9px] text-[#9eb0c8] block">Topic: <strong className="text-white">{goal}</strong></span>
                      </div>
                    </div>
                    <div className="text-[8px] text-[#9eb0c8] font-bold uppercase">Timer length</div>
                    <div className="flex flex-wrap gap-1">
                      {[10,15,20,30,40,60].map(m => (
                        <button key={m} onClick={() => setTimerDuration(m)} className={`rounded-lg px-2 py-1 text-[9px] font-bold cursor-pointer transition-all ${m===timerDuration?"bg-[#19865c] text-white ring-1 ring-[#62e6a5]":"bg-[#16304b] text-[#9eb0c8] hover:bg-[#1f4060]"}`}>{m}m</button>
                      ))}
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button onClick={deny} className="flex-1 py-2 rounded-xl bg-[#a43f4b] text-white text-[10px] font-bold cursor-pointer hover:brightness-110">Deny</button>
                      <button onClick={accept} className="flex-1 py-2 rounded-xl bg-[#19865c] text-white text-[10px] font-bold cursor-pointer hover:brightness-110">Approve · {timerDuration}m</button>
                    </div>
                  </div>
                )}

                {phase === "approved" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="text-3xl">✅</div>
                    <span className="text-sm font-bold text-[#62e6a5]">Parent Approved!</span>
                    <span className="text-[10px] text-[#9eb0c8]">30 minute block</span>
                  </div>
                )}

                {phase === "docked" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                    <div className="text-3xl">🔌</div>
                    <span className="text-sm font-bold text-[#62e6a5]">Phone Docked</span>
                    <div className="mt-2 space-y-1 w-full">
                      {["YouTube","Instagram","WhatsApp"].map(app => (
                        <div key={app} className="flex items-center justify-between bg-[#091525] rounded-lg px-3 py-1.5">
                          <span className="text-[10px] text-[#9eb0c8]">{app}</span>
                          <span className="text-[10px] text-[#e88] font-bold">🔒</span>
                        </div>
                      ))}
                      {["NCERT Books","Khan Academy"].map(app => (
                        <div key={app} className="flex items-center justify-between bg-[#091525] rounded-lg px-3 py-1.5">
                          <span className="text-[10px] text-white">{app}</span>
                          <span className="text-[10px] text-[#62e6a5] font-bold">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(phase === "studying" || phase === "choice" || phase === "sitting_back") && (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <span className="text-[10px] text-[#9eb0c8] font-bold uppercase">Focus Timer</span>
                    <span className="text-4xl font-bold tabular-nums text-[#62e6a5]" style={{textShadow:"0 0 30px rgba(98,230,165,0.5)"}}>{fmt(timer)}</span>
                    <div className="h-2 w-40 rounded-full bg-[#091525] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 bg-[#62e6a5]" style={{width:`${((1800-timer)/1800)*100}%`}} />
                    </div>
                    {isStudying && <span className="text-[10px] text-[#62e6a5] animate-pulse">📖 Studying...</span>}
                  </div>
                )}

                {(phase === "standing_up" || phase === "walking_away") && (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="text-3xl animate-bounce">🚶</div>
                    <span className="text-sm font-bold text-[#e88]">Timer Paused</span>
                    <span className="text-[10px] text-[#9eb0c8]">Student left the desk</span>
                    <span className="text-3xl font-bold tabular-nums text-[#e88]">{fmt(timer)}</span>
                  </div>
                )}

                {phase === "returned" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="text-3xl">🪑</div>
                    <span className="text-sm font-bold text-[#62e6a5]">Welcome back!</span>
                    <span className="text-[10px] text-[#9eb0c8]">Resuming timer...</span>
                  </div>
                )}

                {phase === "timer_done" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="text-3xl">⏱</div>
                    <span className="text-sm font-bold text-[#62e6a5]">Time&apos;s Up!</span>
                    <span className="text-[10px] text-[#9eb0c8]">Checking understanding...</span>
                  </div>
                )}

                {phase === "understanding_check" && (
                  <div className="flex h-full flex-col gap-2 p-3">
                    <span className="text-xs font-extrabold text-[#ffb24c]">Quick Check-in</span>
                    <div className="text-center py-4">
                      <div className="text-4xl mb-3">🤔</div>
                      <span className="text-sm font-bold text-white">Did you understand the concepts well?</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-auto">
                      <button onClick={handleUnderstandingYes} className="py-3 rounded-xl bg-[#19865c]/20 border border-[#19865c]/40 text-[#62e6a5] text-sm font-bold cursor-pointer hover:bg-[#19865c]/30">
                        Yes, I understood well
                      </button>
                      <button onClick={handleUnderstandingNo} className="py-3 rounded-xl bg-[#e88]/20 border border-[#e88]/40 text-[#e88] text-sm font-bold cursor-pointer hover:bg-[#e88]/30">
                        No, some concepts unclear
                      </button>
                    </div>
                  </div>
                )}

                {phase === "unclear_concepts" && (
                  <div className="flex h-full flex-col gap-2 p-3">
                    <span className="text-xs font-extrabold text-[#e88]">Which concepts were unclear?</span>
                    <span className="text-[9px] text-[#9eb0c8]">This will be sent to your parents.</span>
                    <textarea
                      value={unclearText}
                      onChange={e => setUnclearText(e.target.value)}
                      placeholder="E.g., I didn't understand photosynthesis..."
                      rows={3}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#29415f] bg-[#091525] text-white text-[10px] outline-none resize-none"
                    />
                    <button onClick={handleUnclearSubmit} className="mt-auto py-2 rounded-full bg-[#19865c] text-white text-[10px] font-extrabold cursor-pointer">
                      Continue to Summary
                    </button>
                  </div>
                )}

                {phase === "summary_writing" && (
                  <div className="flex h-full flex-col gap-2 p-3">
                    <span className="text-xs font-extrabold text-[#62e6a5]">Write Your Summary</span>
                    <div>
                      <label className="text-[8px] text-[#9eb0c8] font-bold uppercase">Summary</label>
                      <textarea
                        value={summaryText}
                        onChange={e => setSummaryText(e.target.value)}
                        placeholder="Write a brief summary..."
                        rows={2}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#29415f] bg-[#091525] text-white text-[10px] outline-none resize-none mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-[#9eb0c8] font-bold uppercase">Key Highlights</label>
                      <textarea
                        placeholder="List key points..."
                        rows={2}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#29415f] bg-[#091525] text-white text-[10px] outline-none resize-none mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-[#9eb0c8] font-bold uppercase">Your Understanding</label>
                      <textarea
                        placeholder="How well do you understand?"
                        rows={2}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#29415f] bg-[#091525] text-white text-[10px] outline-none resize-none mt-0.5"
                      />
                    </div>
                    <button onClick={handleSummarySubmit} disabled={summaryText.trim().length < 10} className={`mt-auto py-2 rounded-full text-[10px] font-extrabold transition-all ${summaryText.trim().length >= 10 ? "bg-[#19865c] text-white cursor-pointer" : "bg-[#16304b] text-[#4a6080] cursor-not-allowed"}`}>
                      Submit & Start Quiz
                    </button>
                  </div>
                )}

                {phase === "quiz" && (
                  <div className="flex h-full flex-col gap-2 p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-[#9eb0c8] font-bold uppercase">AI Voice Quiz</span>
                      <button onClick={exitQuiz} className="text-[8px] text-[#e88] font-bold cursor-pointer hover:underline">✕ Exit</button>
                    </div>
                    <div className="text-[10px] text-[#9eb0c8] font-bold">Question {qi+1} of 3</div>
                    <div className="rounded-lg border border-[#29415f] bg-[#0b1728] p-3 text-center">
                      <div className="h-10 w-10 mx-auto rounded-full border-2 border-[#62e6a5]/40 bg-[#16304b] flex items-center justify-center animate-pulse text-lg mb-2">🎙️</div>
                      <div className="text-[11px] font-bold text-[#62e6a5]">Listening...</div>
                    </div>
                    <div className="text-[10px] font-bold">{QUIZ[qi]}</div>
                    <div className="text-[9px] text-[#9eb0c8] text-center">Tap the mic button on the lamp to speak your answer</div>
                    <button onClick={submitAnswer} className="py-2 rounded-full bg-[#19865c] text-white text-[10px] font-extrabold cursor-pointer">
                      🎙️ Speak Answer
                    </button>
                  </div>
                )}

                {phase === "quiz_exit" && (
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <div className="text-3xl">⚠️</div>
                    <span className="text-sm font-bold text-[#e88]">Exiting Quiz...</span>
                    <div className="text-5xl font-bold text-[#e88] animate-pulse">3</div>
                    <span className="text-[10px] text-[#9eb0c8]">Penalty: study 10 more min</span>
                  </div>
                )}

                {phase === "penalty" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="text-3xl">📖</div>
                    <span className="text-sm font-bold text-[#e88]">Penalty Mode</span>
                    <span className="text-[10px] text-[#9eb0c8]">Study {fmt(timer)} more before retry</span>
                    <span className="text-3xl font-bold tabular-nums text-[#e88]">{fmt(timer)}</span>
                    <div className="h-2 w-40 rounded-full bg-[#091525] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 bg-[#e88]" style={{width:`${((600-timer)/600)*100}%`}} />
                    </div>
                  </div>
                )}

                {phase === "passed" && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <span className="text-3xl">🏆</span>
                    <span className="text-sm font-extrabold text-[#62e6a5]">Quiz Passed!</span>
                    <span className="text-[10px] font-bold text-[#62e6a5]">+10 ⭐ credits earned</span>
                    <div className="mt-2 rounded-full bg-[#16304b] px-4 py-1.5 text-[9px] font-bold text-[#62e6a5]">Apps Unlocked</div>
                    <div className="mt-2 text-[8px] text-[#9eb0c8] text-center">Report sent to parent</div>
                    <div className="mt-2 w-full space-y-1">
                      <div className="rounded-lg bg-[#0b1728] border border-[#29415f] p-2">
                        <div className="text-[8px] text-[#9eb0c8] font-bold">Score: {score}/3</div>
                        <div className="text-[9px] text-white font-bold">+10 credits added to your balance</div>
                      </div>
                    </div>
                  </div>
                )}

                {phase === "reward" && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <span className="text-3xl">🎁</span>
                    <span className="text-sm font-extrabold text-[#62e6a5]">Reward Unlocked!</span>
                    <span className="text-[9px] text-[#9eb0c8] text-center">Apps unlocked. Report sent to parent.</span>
                    <div className="mt-2 w-full space-y-1">
                      <div className="rounded-lg bg-[#0b1728] border border-[#29415f] p-2">
                        <div className="text-[8px] text-[#9eb0c8] font-bold">Session Complete</div>
                        <div className="text-[9px] text-white">Math — {goal}</div>
                        <div className="text-[8px] text-[#62e6a5] mt-0.5">Score: {score}/3 · +10 credits</div>
                      </div>
                      <div className="rounded-lg bg-[#0b1728] border border-[#19865c]/30 p-2">
                        <div className="text-[8px] text-[#62e6a5] font-bold">✓ Parent notified</div>
                        <div className="text-[8px] text-[#9eb0c8]">Full report with quiz review sent</div>
                      </div>
                    </div>
                  </div>
                )}

                {phase === "denied" && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <span className="text-3xl">😔</span>
                    <span className="text-sm font-extrabold text-[#e88]">Parent Denied</span>
                    <span className="text-[9px] text-[#9eb0c8]">Lamp glowing red. Try again later.</span>
                    <div className="mt-2 w-full rounded-lg bg-[#0b1728] border border-[#e88]/30 p-2">
                      <div className="text-[8px] text-[#e88] font-bold">Session blocked</div>
                      <div className="text-[8px] text-[#9eb0c8]">Parent did not approve this study session</div>
                    </div>
                  </div>
                )}

                {phase === "cheat" && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <span className="text-3xl">🚫</span>
                    <span className="text-sm font-extrabold text-[#e88]">Cheat Detected</span>
                    <span className="text-[9px] text-[#9eb0c8]">Second screen found. Session voided.</span>
                    <div className="mt-2 w-full rounded-lg bg-[#0b1728] border border-[#e88]/30 p-2">
                      <div className="text-[8px] text-[#e88] font-bold">Light sensor alert</div>
                      <div className="text-[8px] text-[#9eb0c8]">No credits earned this session</div>
                    </div>
                  </div>
                )}

                {phase === "sleeping" && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <span className="text-3xl">💤</span>
                    <span className="text-sm font-extrabold text-[#e88]">Student Sleeping!</span>
                    <span className="text-[9px] text-[#9eb0c8]">Heat sensor lost body warmth.</span>
                    <div className="mt-2 w-full rounded-lg bg-[#e88]/10 border border-[#e88]/30 p-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px]">📲</span>
                        <span className="text-[9px] text-[#e88] font-bold">Parent Notification Sent</span>
                      </div>
                      <div className="text-[8px] text-[#9eb0c8]">"{name || 'Your child'} is sleeping during study time."</div>
                      <div className="mt-1.5 bg-[#a43f4b] text-white text-[8px] font-bold px-2 py-1 rounded text-center">
                        ⚠ Return within 30s or timer resets!
                      </div>
                    </div>
                  </div>
                )}

                {phase === "another_device" && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <span className="text-3xl">📱</span>
                    <span className="text-sm font-extrabold text-[#e88]">2nd Device Found!</span>
                    <span className="text-[9px] text-[#9eb0c8]">Light sensor detected another screen.</span>
                    <div className="mt-2 w-full rounded-lg bg-[#e88]/10 border border-[#e88]/30 p-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px]">📲</span>
                        <span className="text-[9px] text-[#e88] font-bold">Parent Notification Sent</span>
                      </div>
                      <div className="text-[8px] text-[#9eb0c8]">"{name || 'Your child'} is using another device!"</div>
                      <div className="mt-1.5 bg-[#e88] text-white text-[8px] font-bold px-2 py-1 rounded text-center">
                        "Stop now and come meet me."
                      </div>
                      <div className="mt-1.5 bg-[#a43f4b]/30 border border-[#e88]/30 text-[#e88] text-[8px] font-bold px-2 py-1 rounded text-center">
                        ⚠ Return phone within 30s or timer resets!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="border-t border-[#29415f] p-4">
            {phase === "goal_form" && <p className="text-xs text-[#9eb0c8] text-center">Fill in your name and tap Send</p>}
            {phase === "parent_phone" && <p className="text-xs text-[#62e6a5] text-center font-bold">⬆ Tap Accept or Deny</p>}
            {phase === "choice" && (
              <div className="flex gap-3">
                <button onClick={leave} className="flex-1 py-3 rounded-xl bg-[#a43f4b] text-white text-sm font-bold cursor-pointer hover:brightness-110">🚶 Student Leaves</button>
                <button onClick={startQuiz} className="flex-1 py-3 rounded-xl bg-[#19865c] text-white text-sm font-bold cursor-pointer hover:brightness-110">⏭ Skip to Quiz</button>
              </div>
            )}
            {(phase === "standing_up" || phase === "walking_away") && (
              <button onClick={returnDesk} className="w-full py-3 rounded-xl bg-[#19865c] text-white text-sm font-bold cursor-pointer hover:brightness-110">🪑 Student Returns to Desk</button>
            )}
            {phase === "timer_done" && <button onClick={() => setPhase("understanding_check")} className="w-full py-3 rounded-xl bg-[#19865c] text-white text-sm font-bold cursor-pointer hover:brightness-110">🧠 Start Quiz</button>}
            {phase === "passed" && <button onClick={release} className="w-full py-3 rounded-xl bg-[#19865c] text-white text-sm font-bold cursor-pointer hover:brightness-110">🎁 Release Reward</button>}
            {["reward","denied"].includes(phase) && <button onClick={reset} className="w-full py-3 rounded-xl bg-[#24415f] text-white text-sm font-bold cursor-pointer hover:brightness-110">↺ Try Again</button>}
            {phase === "cheat" && (
              <div className="space-y-2">
                <p className="text-xs text-[#e88] text-center font-bold">⚠ Student is cheating! Session void.</p>
                <button onClick={reset} className="w-full py-3 rounded-xl bg-[#24415f] text-white text-sm font-bold cursor-pointer hover:brightness-110">↺ End Session</button>
              </div>
            )}
            {phase === "sleeping" && (
              <div className="space-y-2">
                <p className="text-xs text-[#e88] text-center font-bold">⚠ Heat Sensor detected no presence — student sleeping!</p>
                <p className="text-[10px] text-[#e88] text-center">Parent has been notified via push notification.</p>
                <button onClick={() => { setPhase("studying"); setRunning(true); }} className="w-full py-3 rounded-xl bg-[#19865c] text-white text-sm font-bold cursor-pointer hover:brightness-110">⏰ Student Wakes Up — Resume</button>
                <button onClick={reset} className="w-full py-3 rounded-xl bg-[#24415f] text-white text-sm font-bold cursor-pointer hover:brightness-110">↺ End Session</button>
              </div>
            )}
            {phase === "another_device" && (
              <div className="space-y-2">
                <p className="text-xs text-[#e88] text-center font-bold">🚫 Light Sensor detected a second screen!</p>
                <p className="text-[10px] text-[#e88] text-center">Parent notified — told student to stop and meet parent.</p>
                <button onClick={() => { setPhase("studying"); setRunning(true); }} className="w-full py-3 rounded-xl bg-[#19865c] text-white text-sm font-bold cursor-pointer hover:brightness-110">📱 Remove Device — No Cheating, Resume</button>
                <button onClick={reset} className="w-full py-3 rounded-xl bg-[#24415f] text-white text-sm font-bold cursor-pointer hover:brightness-110">↺ End Session</button>
              </div>
            )}
            {phase === "quiz" && <p className="text-xs text-[#9eb0c8] text-center">⬆ Answer on the phone · Exit triggers penalty</p>}
            {phase === "quiz_exit" && <p className="text-xs text-[#e88] text-center font-bold">Penalty starting...</p>}
            {phase === "penalty" && <p className="text-xs text-[#e88] text-center font-bold">📖 Must study before retrying</p>}
            {["intro","walking_in","sitting","app_open","sending","approved","docked","returned","sitting_back"].includes(phase) && (
              <div className="flex items-center justify-center gap-2 py-3">
                <div className="h-2 w-2 rounded-full bg-[#62e6a5] animate-pulse" />
                <span className="text-xs text-[#9eb0c8]">Loading next step...</span>
              </div>
            )}
            {phase === "studying" && (
              <div className="space-y-2">
                <p className="text-[10px] text-[#9eb0c8] text-center font-bold uppercase tracking-wide">Demo Controls</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={triggerSleep} className="py-2 rounded-lg bg-[#e88]/20 border border-[#e88]/40 text-[#e88] text-[11px] font-bold cursor-pointer hover:bg-[#e88]/30">💤 Sleep Detected</button>
                  <button onClick={triggerDevice} className="py-2 rounded-lg bg-[#e88]/20 border border-[#e88]/40 text-[#e88] text-[11px] font-bold cursor-pointer hover:bg-[#e88]/30">📱 2nd Device Found</button>
                  <button onClick={cheat} className="py-2 rounded-lg bg-[#e88]/20 border border-[#e88]/40 text-[#e88] text-[11px] font-bold cursor-pointer hover:bg-[#e88]/30">⚠ Cheat Detected</button>
                  <button onClick={leave} className="py-2 rounded-lg bg-[#ffd9a0]/20 border border-[#ffd9a0]/40 text-[#ffd9a0] text-[11px] font-bold cursor-pointer hover:bg-[#ffd9a0]/30">🚶 Leave Desk</button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button onClick={startQuiz} className="py-2 rounded-lg bg-[#62e6a5]/20 border border-[#62e6a5]/40 text-[#62e6a5] text-[11px] font-bold cursor-pointer hover:bg-[#62e6a5]/30">⏭ Skip to Quiz</button>
                  <button onClick={reset} className="py-2 rounded-lg bg-[#24415f]/60 border border-[#29415f] text-[#9eb0c8] text-[11px] font-bold cursor-pointer hover:bg-[#24415f]">↺ Restart Demo</button>
                </div>
                <p className="text-[9px] text-[#9eb0c8] text-center">Click any button to simulate during demo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}