import { memo, useEffect, useState, useRef } from "react";
import { DollarSign, TrendingUp, Users, Flame } from "lucide-react";
import { playAlertSound } from "@/hooks/useSoundEffects";

/** Animates a number from its previous value to the new target over `duration` ms. */
function useCountUp(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    const start = displayRef.current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const next = Math.round(start + diff * progress);
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}

type Props = {
  cash: number;
  mrr: number;
  users: number;
  burnRate: number;
  prevCash: number;
  prevMrr: number;
  prevUsers: number;
  teamSize: number;
  productScore: number;
  investorTrust: number;
};

const MetricsDashboard = memo(
  ({
    cash,
    mrr,
    users,
    burnRate,
    prevCash,
    prevMrr,
    prevUsers,
    teamSize,
    productScore,
    investorTrust,
  }: Props) => {
    const runway =
      burnRate > mrr
        ? Math.max(0, Math.floor(cash / (burnRate - mrr)))
        : Infinity;
    const runwayPercent =
      runway === Infinity ? 100 : Math.min(100, (runway / 12) * 100);
    const runwayBarColor =
      runway > 6
        ? "bg-secondary"
        : runway > 3
          ? "bg-primary"
          : "bg-destructive";
    const isLowRunway = runway < 3 && runway !== Infinity;

    const alertPlayed = useRef(false);

    const cashDisplay = useCountUp(cash);
    const mrrDisplay = useCountUp(mrr);
    const usersDisplay = useCountUp(users);
    const burnDisplay = useCountUp(burnRate);

    const cashDelta = cash - prevCash;
    const mrrDelta = mrr - prevMrr;
    const usersDelta = users - prevUsers;

    useEffect(() => {
      if (isLowRunway && !alertPlayed.current) {
        playAlertSound();
        alertPlayed.current = true;
      }
      if (!isLowRunway) alertPlayed.current = false;
    }, [isLowRunway]);

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 stagger-children">
          <div
            className={`brutal-card-static p-3 sm:p-4 animate-fade-up ${isLowRunway ? "animate-danger-pulse" : ""}`}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono tracking-wider mb-2">
              <span className="w-5 h-5 bg-primary flex items-center justify-center flex-shrink-0">
                <DollarSign size={12} className="text-primary-foreground" />
              </span>
              CASH RUNWAY
            </div>
            <p className="font-mono text-lg sm:text-xl text-foreground font-medium">
              ${cashDisplay.toLocaleString()}
            </p>
            <div
              className="mt-2 w-full h-1.5 bg-muted overflow-hidden brutal-border"
              style={{ borderWidth: "1px" }}
            >
              <div
                className={`runway-bar ${runwayBarColor}`}
                style={{ width: `${runwayPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono mt-1.5">
              {runway === Infinity ? "∞" : `${runway}mo`} left
              {cashDelta !== 0 && (
                <span
                  className={
                    cashDelta > 0
                      ? "metric-delta-positive ml-2"
                      : "metric-delta-negative ml-2"
                  }
                >
                  {cashDelta > 0 ? "↑" : "↓"} $
                  {Math.abs(cashDelta).toLocaleString()}
                </span>
              )}
            </p>
          </div>

          <div className="brutal-card-static p-3 sm:p-4 animate-fade-up">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono tracking-wider mb-2">
              <span className="w-5 h-5 bg-secondary flex items-center justify-center flex-shrink-0">
                <TrendingUp size={12} className="text-secondary-foreground" />
              </span>
              MONTHLY REVENUE
            </div>
            <p className="font-mono text-lg sm:text-xl text-secondary font-medium">
              ${mrrDisplay.toLocaleString()}
            </p>
            {mrrDelta !== 0 && (
              <p
                className={`text-[10px] font-mono mt-1.5 ${mrrDelta > 0 ? "metric-delta-positive" : "metric-delta-negative"}`}
              >
                {mrrDelta > 0 ? "↑" : "↓"} $
                {Math.abs(mrrDelta).toLocaleString()} last round
              </p>
            )}
          </div>

          <div className="brutal-card-static p-3 sm:p-4 animate-fade-up">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono tracking-wider mb-2">
              <span className="w-5 h-5 bg-accent flex items-center justify-center flex-shrink-0">
                <Users size={12} className="text-accent-foreground" />
              </span>
              USERS
            </div>
            <p className="font-mono text-lg sm:text-xl text-accent font-medium">
              {usersDisplay.toLocaleString()}
            </p>
            {usersDelta !== 0 && (
              <p
                className={`text-[10px] font-mono mt-1.5 ${usersDelta > 0 ? "metric-delta-positive" : "metric-delta-negative"}`}
              >
                {usersDelta > 0 ? "↑" : "↓"}{" "}
                {prevUsers > 0
                  ? `${Math.round((usersDelta / prevUsers) * 100)}%`
                  : `+${usersDelta}`}
              </p>
            )}
          </div>

          <div className="brutal-card-static p-3 sm:p-4 animate-fade-up">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono tracking-wider mb-2">
              <span className="w-5 h-5 bg-destructive flex items-center justify-center flex-shrink-0">
                <Flame size={12} className="text-destructive-foreground" />
              </span>
              BURN RATE
            </div>
            <p className="font-mono text-lg sm:text-xl text-destructive font-medium">
              ${burnDisplay.toLocaleString()}/mo
            </p>
            <p className="text-[10px] text-muted-foreground font-mono mt-1.5">
              Team: {teamSize} {teamSize === 1 ? "person" : "people"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 text-[10px] font-mono text-muted-foreground">
          <div className="flex-1 brutal-card-static px-3 py-2">
            <span className="flex items-center justify-between mb-1">
              <span>PRODUCT</span>
              <span className="text-foreground font-medium">
                {productScore}/100
              </span>
            </span>
            <div
              className="w-full h-1.5 bg-muted overflow-hidden"
              style={{ border: "1px solid hsl(var(--border))" }}
            >
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${productScore}%` }}
              />
            </div>
          </div>
          <div className="flex-1 brutal-card-static px-3 py-2">
            <span className="flex items-center justify-between mb-1">
              <span>TRUST</span>
              <span className="text-foreground font-medium">
                {investorTrust}/100
              </span>
            </span>
            <div
              className="w-full h-1.5 bg-muted overflow-hidden"
              style={{ border: "1px solid hsl(var(--border))" }}
            >
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${investorTrust}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

MetricsDashboard.displayName = "MetricsDashboard";
export default MetricsDashboard;
