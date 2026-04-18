import { memo } from "react";
import { GameStatus } from "@/types/game";
import {
  Pause,
  History,
  Trophy,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Home,
} from "lucide-react";
import PitchWarsLogo from "@/components/PitchWarsLogo";

const STATUS_CONFIG: Record<
  GameStatus,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  start: {
    label: "LOBBY",
    icon: null,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  playing: {
    label: "SERIES A",
    icon: <TrendingUp size={10} />,
    color: "text-secondary-foreground",
    bg: "bg-secondary",
  },
  won: {
    label: "SURVIVED",
    icon: <TrendingUp size={10} />,
    color: "text-secondary-foreground",
    bg: "bg-secondary",
  },
  bankrupt: {
    label: "BANKRUPT",
    icon: <TrendingDown size={10} />,
    color: "text-destructive-foreground",
    bg: "bg-destructive",
  },
  acquired: {
    label: "ACQUIRED",
    icon: <TrendingUp size={10} />,
    color: "text-primary-foreground",
    bg: "bg-primary",
  },
};

type Props = {
  round: number;
  status: GameStatus;
  startupName: string;
  cash: number;
  burnRate: number;
  mrr: number;
  onPause: () => void;
  onHistory: () => void;
  onLeaderboard: () => void;
  onHome: () => void;
};

const GameHeader = memo(
  ({
    round,
    status,
    startupName,
    cash,
    burnRate,
    mrr,
    onPause,
    onHistory,
    onLeaderboard,
    onHome,
  }: Props) => {
    const runway =
      burnRate > mrr
        ? Math.max(0, Math.floor(cash / (burnRate - mrr)))
        : Infinity;
    const isLowRunway = runway < 3 && runway !== Infinity;
    const config = STATUS_CONFIG[status];

    return (
      <div
        className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-card gap-2"
        style={{ borderBottom: "3px solid hsl(var(--border))" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <PitchWarsLogo size={24} />
          <h1 className="font-display text-foreground text-base sm:text-lg tracking-tight whitespace-nowrap">
            PITCH WARS
          </h1>
          <span className="text-muted-foreground font-mono text-[10px] truncate hidden sm:block">
            · {startupName}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isLowRunway && (
            <span className="brutal-tag bg-destructive text-destructive-foreground flex items-center gap-1 animate-danger-pulse text-[9px] sm:text-[10px]">
              <AlertTriangle size={9} /> {runway}mo
            </span>
          )}

          <span className="font-display text-sm sm:text-lg text-foreground">
            R{round}/10
          </span>

          <span
            className={`brutal-tag ${config.bg} ${config.color} flex items-center gap-1 hidden sm:flex`}
          >
            {config.icon} {config.label}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onHome}
            className="brutal-btn p-2 bg-card text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Home"
          >
            <Home size={14} />
          </button>
          <button
            onClick={onHistory}
            className="brutal-btn p-2 bg-card text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="History"
          >
            <History size={14} />
          </button>
          <button
            onClick={onLeaderboard}
            className="brutal-btn p-2 bg-card text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Leaderboard"
          >
            <Trophy size={14} />
          </button>
          <button
            onClick={onPause}
            className="brutal-btn p-2 bg-card text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Pause (P)"
          >
            <Pause size={14} />
          </button>
        </div>
      </div>
    );
  },
);

GameHeader.displayName = "GameHeader";
export default GameHeader;
