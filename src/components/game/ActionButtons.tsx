import { memo } from "react";
import { PlayerAction, ACTION_LABELS } from "@/types/game";
import {
  Rocket,
  Megaphone,
  Users,
  DollarSign,
  Ban,
  Star,
  Loader2,
} from "lucide-react";
import { playClickSound } from "@/hooks/useSoundEffects";

const ICON_MAP: Record<string, React.ReactNode> = {
  Rocket: <Rocket size={18} />,
  Megaphone: <Megaphone size={18} />,
  Users: <Users size={18} />,
  DollarSign: <DollarSign size={18} />,
};

const PLAYER_ACTIONS: PlayerAction[] = ["ship", "market", "hire", "fundraise"];

type Props = {
  onAction: (action: PlayerAction) => void;
  disabled: boolean;
  investorTrust: number;
  cash: number;
  recommendedAction: PlayerAction | null;
  selectedAction: PlayerAction | null;
};

const ActionButtons = memo(
  ({
    onAction,
    disabled,
    investorTrust,
    cash,
    recommendedAction,
    selectedAction,
  }: Props) => {
    const isActionDisabled = (action: PlayerAction): boolean => {
      if (disabled) return true;
      if (action === "fundraise" && investorTrust <= 0) return true;
      if (action === "fundraise" && investorTrust < 40) return true;
      if (action === "ship" && cash < 3000) return true;
      if (action === "market" && cash < 8000) return true;
      return false;
    };

    const getDisabledReason = (action: PlayerAction): string | null => {
      if (action === "fundraise" && investorTrust <= 0)
        return "Victor has ghosted you.";
      if (action === "fundraise" && investorTrust < 40)
        return `Trust too low (${investorTrust}/100)`;
      if (action === "ship" && cash < 3000)
        return "Not enough cash ($3K needed)";
      if (action === "market" && cash < 8000)
        return "Not enough cash ($8K needed)";
      return null;
    };

    const handleAction = (action: PlayerAction) => {
      playClickSound();
      onAction(action);
    };

    return (
      <div className="space-y-3">
        <p className="font-display text-xs text-foreground tracking-wider">
          CHOOSE YOUR MOVE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
          {PLAYER_ACTIONS.map((action) => {
            const { icon, label, description, cost } = ACTION_LABELS[action];
            const isDisabled = isActionDisabled(action);
            const isRecommended = recommendedAction === action && !isDisabled;
            const isSelected = selectedAction === action;
            const disabledReason = getDisabledReason(action);

            return (
              <button
                key={action}
                onClick={() => handleAction(action)}
                disabled={isDisabled}
                className={`text-left p-4 transition-all relative animate-fade-up min-h-[80px]
                ${
                  isDisabled
                    ? "opacity-30 cursor-not-allowed brutal-card-static"
                    : isSelected
                      ? "brutal-card-static animate-gold-pulse"
                      : "brutal-card"
                }
              `}
                style={
                  isRecommended && !isSelected
                    ? {
                        borderColor: "hsl(var(--primary))",
                        boxShadow: "6px 6px 0px hsl(var(--primary))",
                      }
                    : undefined
                }
                title={disabledReason || undefined}
              >
                {isRecommended && !isSelected && (
                  <span className="absolute -top-3 right-2 brutal-tag bg-primary text-primary-foreground flex items-center gap-1 py-0.5 px-2">
                    <Star size={8} /> RECOMMENDED
                  </span>
                )}
                {isSelected && (
                  <span className="absolute -top-3 right-2 brutal-tag bg-primary text-primary-foreground flex items-center gap-1 py-0.5 px-2">
                    <Loader2 size={8} className="animate-spin" /> EXECUTING
                  </span>
                )}
                <div className="flex items-center gap-2.5 font-display text-sm text-foreground">
                  <span className="w-8 h-8 bg-foreground text-background flex items-center justify-center flex-shrink-0">
                    {ICON_MAP[icon]}
                  </span>
                  {label}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-body">
                  {description}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {cost}
                </p>
                {disabledReason && (
                  <p className="text-[10px] text-destructive mt-2 font-mono flex items-center gap-1">
                    <Ban size={10} /> {disabledReason}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

ActionButtons.displayName = "ActionButtons";
export default ActionButtons;
