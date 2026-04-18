import { useState, useEffect } from "react";
import { GameState, calcScore } from "@/types/game";
import {
  Trophy,
  Skull,
  Building2,
  RotateCcw,
  Share2,
  Trophy as TrophyIcon,
} from "lucide-react";
import {
  playCoinSound,
  playSuccessSound,
  playAlertSound,
} from "@/hooks/useSoundEffects";
import { getCookieJSON } from "@/lib/cookies";
import { GameRecord } from "@/types/game";
import ConfettiBurst from "./ConfettiBurst";
import LeaderboardModal from "./LeaderboardModal";

const OUTCOME_CONFIGS = {
  won: {
    borderColor: "hsl(var(--secondary))",
    icon: <Trophy size={32} className="text-secondary" />,
    title: "YOU SURVIVED.",
    titleColor: "text-secondary",
  },
  bankrupt: {
    borderColor: "hsl(var(--destructive))",
    icon: <Skull size={32} className="text-destructive" />,
    title: "OUT OF RUNWAY",
    titleColor: "text-destructive",
  },
  acquired: {
    borderColor: "hsl(var(--primary))",
    icon: <Building2 size={32} className="text-primary" />,
    title: "ACQUISITION OFFER",
    titleColor: "text-primary",
  },
};

const GameOverScreen = ({
  state,
  onRestart,
}: {
  state: GameState;
  onRestart: () => void;
}) => {
  const [victorQuote, setVictorQuote] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [madeLeaderboard, setMadeLeaderboard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (state.gameStatus === "acquired") {
      playCoinSound();
      setShowConfetti(true);
    } else if (state.gameStatus === "won") {
      playSuccessSound();
    } else {
      playAlertSound();
    }

    const leaderboard = getCookieJSON<GameRecord[]>("pw_leaderboard") ?? [];
    const score = calcScore(state);
    if (
      leaderboard.length < 10 ||
      score > (leaderboard[leaderboard.length - 1]?.score ?? 0)
    ) {
      setMadeLeaderboard(true);
    }

    const fetchVictorVerdict = async () => {
      try {
        const outcomeLabel =
          state.gameStatus === "won"
            ? "survived 10 rounds"
            : state.gameStatus === "acquired"
              ? "got acquired"
              : "went bankrupt";

        const resp = await fetch("/api/investor-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `The game is over. ${state.founderName}'s startup ${state.startupName} ${outcomeLabel}. Final metrics: Cash $${state.cash}, MRR $${state.mrr}, ${state.users} users, ${state.round} rounds. Write ONE memorable 1-sentence verdict. Be harsh but true.`,
              },
            ],
          }),
        });
        const data = await resp.json();
        if (data?.content) setVictorQuote(data.content);
      } catch {
        setVictorQuote(
          state.gameStatus === "bankrupt"
            ? '"I told you the burn rate was insane."'
            : '"Not bad. Not great. But not bad."',
        );
      }
    };

    fetchVictorVerdict();
    // state is intentionally excluded  this effect runs once on mount for the final verdict
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = state.gameStatus as "won" | "bankrupt" | "acquired";
  const config = OUTCOME_CONFIGS[status];
  if (!config) return null;

  const subtitleText =
    status === "won"
      ? `${state.startupName} made it through 10 rounds.`
      : status === "bankrupt"
        ? `${state.startupName} is dead. Cash hit $0 on Round ${state.round}.`
        : `Big Co wants ${state.startupName}. Offer: $${((state.mrr * 18) / 1000).toFixed(0)}K`;

  const shareText = `I just played Pitch Wars 🎮\nStartup: ${state.startupName} · Outcome: ${status.toUpperCase()}\nMRR: $${state.mrr.toLocaleString()} · ${state.round} rounds survived`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const summaryMetrics = [
    { label: "FINAL CASH", value: `$${state.cash.toLocaleString()}` },
    { label: "MRR", value: `$${state.mrr.toLocaleString()}` },
    { label: "USERS", value: state.users.toLocaleString() },
    { label: "ROUNDS", value: `${state.round} / 10` },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4 overflow-y-auto">
      <ConfettiBurst
        active={showConfetti}
        onDone={() => setShowConfetti(false)}
      />

      <div
        className="max-w-md w-full brutal-card-static p-6 sm:p-8 space-y-6 animate-bounce-in my-auto"
        style={{ borderColor: config.borderColor }}
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center animate-pop-in">
            {config.icon}
          </div>
          <h2
            className={`font-display text-3xl sm:text-4xl ${config.titleColor}`}
          >
            {config.title}
          </h2>
          <p className="text-muted-foreground font-body text-sm">
            {subtitleText}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm stagger-children">
          {summaryMetrics.map((m) => (
            <div
              key={m.label}
              className="brutal-card-static p-3 animate-fade-up"
            >
              <p className="text-muted-foreground font-mono text-[10px] tracking-wider">
                {m.label}
              </p>
              <p className="font-mono text-lg text-foreground font-medium">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {victorQuote && (
          <div
            className="brutal-card-static p-3 animate-slide-left"
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: "hsl(var(--primary))",
            }}
          >
            <p className="text-[10px] text-primary font-display mb-1">
              Victor Chen
            </p>
            <p className="font-mono text-xs text-foreground italic">
              {victorQuote}
            </p>
          </div>
        )}

        {madeLeaderboard && (
          <p className="text-center font-display text-sm text-primary flex items-center justify-center gap-1 animate-bounce-in">
            <TrophyIcon size={14} /> HALL OF FOUNDERS!
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onRestart}
            className="flex-1 brutal-btn-gold font-display py-3 flex items-center justify-center gap-2 text-sm min-h-[44px]"
          >
            <RotateCcw size={16} /> PLAY AGAIN
          </button>
          <button
            onClick={handleShare}
            className="brutal-btn px-4 py-3 bg-card text-foreground flex items-center gap-1 font-mono text-xs min-h-[44px]"
          >
            <Share2 size={14} /> {copied ? "Copied!" : "Share"}
          </button>
        </div>

        <button
          onClick={() => setShowLeaderboard(true)}
          className="w-full text-xs text-muted-foreground font-mono hover:text-foreground transition flex items-center justify-center gap-1 min-h-[44px]"
        >
          <Trophy size={12} /> Leaderboard
        </button>
      </div>

      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};

export default GameOverScreen;
