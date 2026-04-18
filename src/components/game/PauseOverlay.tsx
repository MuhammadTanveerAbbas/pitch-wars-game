import { Pause, Play, LogOut } from "lucide-react";

type Props = {
  onResume: () => void;
  onQuit: () => void;
};

const PauseOverlay = ({ onResume, onQuit }: Props) => {
  return (
    <div className="absolute inset-0 z-40 bg-background/90 flex items-center justify-center">
      <div className="text-center space-y-6 animate-bounce-in px-4">
        <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center mx-auto">
          <Pause size={32} />
        </div>
        <h2 className="font-display text-3xl text-foreground">GAME PAUSED</h2>
        <p className="text-sm text-muted-foreground font-mono">
          Victor is also waiting
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onResume}
            className="brutal-btn-gold font-display px-6 py-3 flex items-center gap-2 text-sm min-h-[44px]"
          >
            <Play size={16} /> RESUME
          </button>
          <button
            onClick={onQuit}
            className="brutal-btn font-mono text-sm px-6 py-3 bg-card text-foreground flex items-center gap-2 min-h-[44px]"
          >
            <LogOut size={14} /> QUIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseOverlay;
