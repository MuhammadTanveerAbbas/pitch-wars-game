import { Star } from "lucide-react";

type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

const AdvisorBanner = ({ onAccept, onDecline }: Props) => {
  return (
    <div
      className="animate-bounce-in brutal-card-static p-4"
      style={{
        borderColor: "hsl(var(--primary))",
        boxShadow: "6px 6px 0px hsl(var(--primary))",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
          <Star size={12} />
        </div>
        <p className="font-display text-sm text-foreground">
          VICTOR IS OFFERING ADVICE
        </p>
      </div>
      <p className="text-xs text-muted-foreground font-mono mb-3">
        He'll recommend one action based on your metrics.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="brutal-btn-gold font-display text-xs px-4 py-2 min-h-[44px]"
        >
          ACCEPT
        </button>
        <button
          onClick={onDecline}
          className="brutal-btn font-display text-xs px-4 py-2 bg-card text-foreground min-h-[44px]"
        >
          DECLINE
        </button>
      </div>
    </div>
  );
};

export default AdvisorBanner;
