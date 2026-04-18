import { memo } from "react";
import { MarketEvent } from "@/types/game";
import {
  Flame,
  Newspaper,
  UserMinus,
  Share2,
  TrendingDown,
  Eye,
  Bug,
  Handshake,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Flame: <Flame size={18} />,
  Newspaper: <Newspaper size={18} />,
  UserMinus: <UserMinus size={18} />,
  Share2: <Share2 size={18} />,
  TrendingDown: <TrendingDown size={18} />,
  Eye: <Eye size={18} />,
  Bug: <Bug size={18} />,
  Handshake: <Handshake size={18} />,
};

const EFFECT_LABELS: Record<string, string> = {
  users: "Users",
  mrr: "MRR",
  investorTrust: "Trust",
  productScore: "Product",
};

const MarketEventBanner = memo(
  ({
    event,
    onAcknowledge,
  }: {
    event: MarketEvent;
    onAcknowledge: () => void;
  }) => {
    const isNegative = Object.values(event.effect).some((v) => (v ?? 0) < 0);

    return (
      <div
        className="animate-bounce-in brutal-card-static p-4 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
        style={{
          borderLeftWidth: "6px",
          borderLeftColor: isNegative
            ? "hsl(var(--destructive))"
            : "hsl(var(--secondary))",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${isNegative ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            {ICON_MAP[event.icon] ?? <Flame size={18} />}
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm text-foreground">
              {event.label}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {Object.entries(event.effect)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => {
                  const numValue = value ?? 0;
                  return (
                    <span
                      key={key}
                      className={`mr-2 ${numValue > 0 ? "text-secondary" : "text-destructive"} font-medium`}
                    >
                      {EFFECT_LABELS[key] ?? key} {numValue > 0 ? "+" : ""}
                      {numValue}
                    </span>
                  );
                })}
            </p>
          </div>
        </div>
        <button
          onClick={onAcknowledge}
          className="brutal-btn font-display text-xs px-4 py-2 bg-card text-foreground hover:bg-muted min-h-[44px] flex-shrink-0"
        >
          GOT IT →
        </button>
      </div>
    );
  },
);

MarketEventBanner.displayName = "MarketEventBanner";
export default MarketEventBanner;
