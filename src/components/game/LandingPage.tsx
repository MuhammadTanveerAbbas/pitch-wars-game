import { useState, useEffect } from "react";
import {
  Rocket, Megaphone, Users, DollarSign, TrendingUp, Flame,
  ArrowRight, Trophy, History, Zap, Star, Target, Brain,
  ChevronDown, Github, Twitter, Cpu, Database, Globe,
  Shield, BarChart2, MessageSquare, Award, Crown, Skull,
  Building2, Play, RotateCcw, Home,
} from "lucide-react";
import { RANDOM_STARTUPS, RANDOM_FOUNDERS, SavedGame, GameRecord } from "@/types/game";
import { getCookie, setCookie, getCookieJSON } from "@/lib/cookies";
import HistoryModal from "./HistoryModal";
import LeaderboardModal from "./LeaderboardModal";
import PitchWarsLogo from "@/components/PitchWarsLogo";

type Props = {
  onStart: (founderName: string, startupName: string) => void;
  onResume: (save: SavedGame) => void;
  savedGame: SavedGame | null;
};

const FEATURES = [
  {
    icon: <Brain size={20} />,
    title: "AI INVESTOR",
    desc: "Victor Chen reacts to every move with real Groq LLM responses. No scripted lines.",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: <BarChart2 size={20} />,
    title: "LIVE METRICS",
    desc: "Track cash, MRR, burn rate, users, and investor trust across 10 brutal rounds.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: <Target size={20} />,
    title: "MARKET EVENTS",
    desc: "Random shocks hit every round  viral threads, churned clients, competitor launches.",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: <Shield size={20} />,
    title: "ADVISOR MODE",
    desc: "Earn Victor's trust by Round 5 and unlock AI-recommended actions.",
    color: "bg-destructive text-destructive-foreground",
  },
];

const HOW_TO_PLAY = [
  { step: "01", title: "Name your startup", desc: "Pick a founder name and startup. Or let the game randomize one." },
  { step: "02", title: "Face the market", desc: "Each round opens with a market event that shifts your metrics." },
  { step: "03", title: "Choose your action", desc: "Ship Feature, Run Marketing, Hire Developer, or Fundraise." },
  { step: "04", title: "Victor reacts", desc: "The AI investor judges your move and updates his trust score." },
  { step: "05", title: "Survive 10 rounds", desc: "Hit $15K MRR for acquisition, or outlast the runway." },
];

const ACTIONS = [
  { icon: <Rocket size={18} />, label: "SHIP FEATURE", cost: "$3,000", effect: "+Product Score, +Users", color: "bg-accent" },
  { icon: <Megaphone size={18} />, label: "RUN MARKETING", cost: "$8,000", effect: "+Users, +MRR", color: "bg-secondary" },
  { icon: <Users size={18} />, label: "HIRE DEVELOPER", cost: "+$12k/mo burn", effect: "+Team Capacity", color: "bg-primary" },
  { icon: <DollarSign size={18} />, label: "FUNDRAISE", cost: "Needs Trust > 40", effect: "+Cash (Victor decides)", color: "bg-destructive" },
];

const MARKET_EVENTS_DISPLAY = [
  { icon: "🔥", label: "Competitor launched", effect: "Users -10, Trust -5" },
  { icon: "📰", label: "TechCrunch mention", effect: "Users +30, MRR +$500" },
  { icon: "📉", label: "Enterprise churn", effect: "MRR -$1K, Trust -8" },
  { icon: "🚀", label: "Thread went viral", effect: "Users +50" },
  { icon: "🤝", label: "Partnership deal", effect: "MRR +$800, Trust +10" },
  { icon: "📊", label: "Market downturn", effect: "MRR -15%, Trust -10" },
];

const TECH_STACK = [
  { icon: <Globe size={16} />, name: "React + Vite", desc: "Frontend framework" },
  { icon: <Cpu size={16} />, name: "Groq LLM", desc: "llama-3.3-70b-versatile" },
  { icon: <Database size={16} />, name: "Vercel", desc: "API Routes + Deploy" },
  { icon: <Star size={16} />, name: "Tailwind CSS", desc: "Brutalist design system" },
  { icon: <MessageSquare size={16} />, name: "TypeScript", desc: "Type-safe game logic" },
  { icon: <Zap size={16} />, name: "Web Audio API", desc: "Sound effects" },
];

const OUTCOME_ICONS: Record<string, JSX.Element> = {
  survived: <Trophy size={12} className="text-secondary" />,
  acquired: <Building2 size={12} className="text-primary" />,
  bankrupt: <Skull size={12} className="text-destructive" />,
};

const OUTCOME_COLORS: Record<string, string> = {
  survived: "bg-secondary text-secondary-foreground",
  acquired: "bg-primary text-primary-foreground",
  bankrupt: "bg-destructive text-destructive-foreground",
};

export default function LandingPage({ onStart, onResume, savedGame }: Props) {
  const [startupName, setStartupName] = useState("");
  const [founderName, setFounderName] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const leaderboard: GameRecord[] = getCookieJSON<GameRecord[]>("pw_leaderboard") ?? [];
  const topScore = leaderboard[0]?.score ?? 0;

  useEffect(() => {
    const sf = getCookie("pw_founder_name");
    const ss = getCookie("pw_startup_name");
    if (sf) setFounderName(sf);
    if (ss) setStartupName(ss);
  }, []);

  const handleStart = () => {
    const f = founderName.trim() || RANDOM_FOUNDERS[Math.floor(Math.random() * RANDOM_FOUNDERS.length)];
    const s = startupName.trim() || RANDOM_STARTUPS[Math.floor(Math.random() * RANDOM_STARTUPS.length)];
    setCookie("pw_founder_name", f, 365);
    setCookie("pw_startup_name", s, 365);
    onStart(f, s);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 bg-background brutal-border border-t-0 border-l-0 border-r-0 border-b-[3px] flex items-center justify-between px-4 sm:px-8 h-14">
        <button onClick={() => scrollTo("hero")} className="font-display text-lg flex items-center gap-2">
          <PitchWarsLogo size={28} /> PITCH WARS
        </button>
        <div className="hidden sm:flex items-center gap-1">
          {["features", "how-to-play", "leaderboard", "tech"].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="font-mono text-xs text-muted-foreground hover:text-foreground px-3 py-1 transition-colors"
            >
              {id.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={handleStart} className="brutal-btn-gold font-display text-xs px-4 py-2 flex items-center gap-1 min-h-[36px]">
          <Play size={12} /> PLAY
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 text-center relative">
        <div className="animate-fade-up">
          <span className="brutal-tag inline-block bg-primary text-primary-foreground mb-6">
            <Zap size={10} className="inline mr-1" /> SEASON 1 · SERIES A HUNT
          </span>
        </div>

        <div className="animate-bounce-in mb-4">
          <PitchWarsLogo size={72} />
        </div>

        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl tracking-tight leading-none animate-bounce-in mb-4">
          PITCH<br />WARS
        </h1>

        <p className="font-body text-muted-foreground text-lg sm:text-xl max-w-md mb-2 animate-fade-up" style={{ animationDelay: "200ms" }}>
          A turn-based AI startup simulator.
        </p>
        <p className="font-mono text-sm text-muted-foreground mb-10 animate-fade-up" style={{ animationDelay: "300ms" }}>
          10 rounds · 1 investor · don't run out of money
        </p>

        {/* Starter metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 w-full max-w-lg animate-fade-up" style={{ animationDelay: "350ms" }}>
          {[
            { label: "START CASH", value: "$50,000", icon: <DollarSign size={14} />, bg: "bg-primary" },
            { label: "ROUNDS", value: "10", icon: <Target size={14} />, bg: "bg-accent" },
            { label: "WIN AT MRR", value: "$15,000", icon: <TrendingUp size={14} />, bg: "bg-secondary" },
            { label: "BURN RATE", value: "$5k/mo", icon: <Flame size={14} />, bg: "bg-destructive" },
          ].map((m) => (
            <div key={m.label} className="brutal-card p-3 text-left">
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider flex items-center gap-1 mb-1">
                <span className={`w-4 h-4 ${m.bg} flex items-center justify-center text-white`}>{m.icon}</span>
                {m.label}
              </p>
              <p className="font-mono text-base font-medium">{m.value}</p>
            </div>
          ))}
        </div>

        {/* High score banner */}
        {topScore > 0 && (
          <div className="brutal-card-static border-primary px-5 py-2 mb-6 animate-gold-pulse flex items-center gap-2" style={{ borderColor: "hsl(var(--primary))" }}>
            <Crown size={14} className="text-primary" />
            <span className="font-mono text-xs">HIGH SCORE: <strong>{topScore.toLocaleString()}</strong>  {leaderboard[0].startupName}</span>
          </div>
        )}

        {/* CTA */}
        <div className="w-full max-w-sm space-y-3 animate-fade-up" style={{ animationDelay: "450ms" }}>
          {savedGame && (
            <div className="brutal-card-static p-3 flex items-center justify-between gap-3" style={{ borderColor: "hsl(var(--primary))" }}>
              <div className="min-w-0">
                <p className="text-xs font-display truncate">SAVED: {savedGame.startupName} · R{savedGame.savedRound}/10</p>
                <p className="text-xs text-muted-foreground font-mono">${savedGame.gameState.cash.toLocaleString()} · MRR ${savedGame.gameState.mrr.toLocaleString()}</p>
              </div>
              <button onClick={() => onResume(savedGame)} className="brutal-btn-gold font-display text-xs px-4 py-2 whitespace-nowrap min-h-[40px]">
                CONTINUE →
              </button>
            </div>
          )}

          <div className="brutal-card-static p-4 space-y-3">
            <input
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value.slice(0, 24))}
              placeholder="Startup name (e.g. Pivotly)"
              className="w-full bg-background brutal-border text-foreground font-body text-sm p-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 min-h-[44px]"
            />
            <input
              type="text"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value.slice(0, 20))}
              placeholder="Your name, founder"
              className="w-full bg-background brutal-border text-foreground font-body text-sm p-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 min-h-[44px]"
            />
          </div>

          <button onClick={handleStart} className="w-full brutal-btn-gold font-display text-xl py-4 flex items-center justify-center gap-2 min-h-[56px]">
            START PITCHING <ArrowRight size={20} />
          </button>

          <div className="flex justify-center gap-3">
            <button onClick={() => setShowHistory(true)} className="brutal-btn text-xs font-mono px-3 py-2 bg-card flex items-center gap-1.5 hover:bg-muted min-h-[40px]">
              <History size={12} /> History
            </button>
            <button onClick={() => setShowLeaderboard(true)} className="brutal-btn text-xs font-mono px-3 py-2 bg-card flex items-center gap-1.5 hover:bg-muted min-h-[40px]">
              <Trophy size={12} /> Leaderboard
            </button>
          </div>
        </div>


      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-4 sm:px-8 py-20 max-w-5xl mx-auto">
        <p className="brutal-tag inline-block bg-accent text-accent-foreground mb-8">FEATURES</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-10">WHAT MAKES IT BRUTAL</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {FEATURES.map((f) => (
            <div key={f.title} className="brutal-card p-5 space-y-3 animate-fade-up">
              <div className={`w-9 h-9 ${f.color} flex items-center justify-center`}>{f.icon}</div>
              <p className="font-display text-sm">{f.title}</p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW TO PLAY ── */}
      <section id="how-to-play" className="px-4 sm:px-8 py-20 bg-card border-y-[3px] border-border">
        <div className="max-w-5xl mx-auto">
          <p className="brutal-tag inline-block bg-secondary text-secondary-foreground mb-8">HOW TO PLAY</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-10">5 STEPS TO SURVIVE</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
            {HOW_TO_PLAY.map((s) => (
              <div key={s.step} className="brutal-card-static p-4 space-y-2 animate-fade-up">
                <p className="font-display text-3xl text-primary">{s.step}</p>
                <p className="font-display text-xs">{s.title.toUpperCase()}</p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAME ELEMENTS ── */}
      <section id="game-elements" className="px-4 sm:px-8 py-20 max-w-5xl mx-auto">
        <p className="brutal-tag inline-block bg-primary text-primary-foreground mb-8">GAME ELEMENTS</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-10">ACTIONS & EVENTS</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="font-display text-sm mb-4 text-muted-foreground">YOUR 4 ACTIONS</p>
            <div className="space-y-2 stagger-children">
              {ACTIONS.map((a) => (
                <div key={a.label} className="brutal-card p-3 flex items-center gap-3 animate-fade-up">
                  <div className={`w-8 h-8 ${a.color} text-white flex items-center justify-center flex-shrink-0`}>{a.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xs">{a.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{a.cost} · {a.effect}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display text-sm mb-4 text-muted-foreground">MARKET EVENTS</p>
            <div className="grid grid-cols-2 gap-2 stagger-children">
              {MARKET_EVENTS_DISPLAY.map((e) => (
                <div key={e.label} className="brutal-card-static p-3 animate-fade-up">
                  <p className="text-xl mb-1">{e.icon}</p>
                  <p className="font-display text-[10px] leading-tight">{e.label.toUpperCase()}</p>
                  <p className="font-mono text-[9px] text-muted-foreground mt-1">{e.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS / STATS ── */}
      <section id="achievements" className="px-4 sm:px-8 py-20 bg-card border-y-[3px] border-border">
        <div className="max-w-5xl mx-auto">
          <p className="brutal-tag inline-block bg-destructive text-destructive-foreground mb-8">ACHIEVEMENTS</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-10">WIN CONDITIONS</h2>
          <div className="grid sm:grid-cols-3 gap-4 stagger-children">
            {[
              { icon: <Trophy size={24} className="text-secondary" />, title: "SURVIVED", desc: "Complete all 10 rounds without going bankrupt.", border: "hsl(var(--secondary))" },
              { icon: <Building2 size={24} className="text-primary" />, title: "ACQUIRED", desc: "Hit $15,000 MRR and get a Big Co acquisition offer.", border: "hsl(var(--primary))" },
              { icon: <Award size={24} className="text-accent" />, title: "HALL OF FOUNDERS", desc: "Score high enough to make the all-time leaderboard.", border: "hsl(var(--accent))" },
            ].map((a) => (
              <div key={a.title} className="brutal-card-static p-5 space-y-3 animate-fade-up" style={{ borderColor: a.border }}>
                {a.icon}
                <p className="font-display text-sm">{a.title}</p>
                <p className="font-body text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>

          {leaderboard.length > 0 && (
            <div className="mt-8">
              <p className="font-display text-xs text-muted-foreground mb-3">YOUR BEST RUNS</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 stagger-children">
                {leaderboard.slice(0, 3).map((r, i) => (
                  <div key={i} className="brutal-card-static p-3 flex items-center gap-3 animate-fade-up">
                    <span className="font-display text-2xl text-muted-foreground">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xs truncate">{r.startupName}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{r.score.toLocaleString()} pts · {r.date}</p>
                    </div>
                    <span className={`brutal-tag ${OUTCOME_COLORS[r.outcome]} text-[8px] flex items-center gap-1`}>
                      {OUTCOME_ICONS[r.outcome]} {r.outcome.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── LEADERBOARD ── */}
      <section id="leaderboard" className="px-4 sm:px-8 py-20 max-w-5xl mx-auto">
        <p className="brutal-tag inline-block bg-primary text-primary-foreground mb-8">LEADERBOARD</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-10">HALL OF FOUNDERS</h2>
        {leaderboard.length === 0 ? (
          <div className="brutal-card-static p-10 text-center">
            <Trophy size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="font-mono text-sm text-muted-foreground">No scores yet. Be the first founder.</p>
            <button onClick={handleStart} className="brutal-btn-gold font-display text-sm px-6 py-3 mt-4 flex items-center gap-2 mx-auto">
              <Play size={14} /> START NOW
            </button>
          </div>
        ) : (
          <div className="brutal-card-static overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="text-[10px] text-muted-foreground font-mono tracking-wider border-b-[3px] border-border">
                    {["#", "STARTUP", "FOUNDER", "SCORE", "MRR", "ROUNDS", "OUTCOME"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="stagger-children">
                  {leaderboard.map((r, i) => (
                    <tr key={i} className={`text-xs font-mono animate-fade-up border-b border-border/30 ${i === 0 ? "bg-primary/5" : ""}`}>
                      <td className={`px-4 py-3 font-display ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}</td>
                      <td className="px-4 py-3 font-medium max-w-[100px] truncate">{r.startupName}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[100px] truncate">{r.founderName}</td>
                      <td className={`px-4 py-3 font-medium ${i === 0 ? "text-primary" : ""}`}>{r.score.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">${r.finalMRR.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.roundsCompleted}/10</td>
                      <td className="px-4 py-3">
                        <span className={`brutal-tag ${OUTCOME_COLORS[r.outcome]} text-[8px] flex items-center gap-1 w-fit`}>
                          {OUTCOME_ICONS[r.outcome]} {r.outcome.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── TECH STACK ── */}
      <section id="tech" className="px-4 sm:px-8 py-20 bg-card border-y-[3px] border-border">
        <div className="max-w-5xl mx-auto">
          <p className="brutal-tag inline-block bg-accent text-accent-foreground mb-8">TECH STACK</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-10">BUILT WITH</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger-children">
            {TECH_STACK.map((t) => (
              <div key={t.name} className="brutal-card p-4 text-center space-y-2 animate-fade-up">
                <div className="w-8 h-8 bg-muted flex items-center justify-center mx-auto">{t.icon}</div>
                <p className="font-display text-[10px]">{t.name}</p>
                <p className="font-mono text-[9px] text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 sm:px-8 py-12 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl flex items-center gap-2 mb-1">
              <PitchWarsLogo size={32} /> PITCH WARS
            </p>
            <p className="font-mono text-xs text-muted-foreground">A turn-based AI startup simulator · Season 1</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleStart} className="brutal-btn-gold font-display text-sm px-5 py-2.5 flex items-center gap-2 min-h-[44px]">
              <Play size={14} /> PLAY NOW
            </button>
            <button onClick={() => setShowLeaderboard(true)} className="brutal-btn font-mono text-xs px-4 py-2.5 bg-card flex items-center gap-1.5 min-h-[44px]">
              <Trophy size={12} /> Scores
            </button>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t-[3px] border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-muted-foreground">
            Built with React, Groq AI, Vercel · Scores stored locally in cookies
          </p>
          <div className="flex items-center gap-4">
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Cpu size={10} /> Groq API
            </a>
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Database size={10} /> Vercel
            </a>
          </div>
        </div>
      </footer>

      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}
