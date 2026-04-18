import { X, Trophy } from "lucide-react";
import { GameRecord } from "@/types/game";
import { getCookieJSON } from "@/lib/cookies";

const OUTCOME_STYLES: Record<string, string> = {
  survived: "bg-secondary text-secondary-foreground",
  bankrupt: "bg-destructive text-destructive-foreground",
  acquired: "bg-primary text-primary-foreground",
};

const LeaderboardModal = ({ onClose }: { onClose: () => void }) => {
  const leaderboard: GameRecord[] =
    getCookieJSON<GameRecord[]>("pw_leaderboard") ?? [];

  return (
    <div
      className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full brutal-card-static p-4 sm:p-6 animate-bounce-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="font-display text-xl sm:text-2xl text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
              <Trophy size={16} />
            </div>
            HALL OF FOUNDERS
          </h2>
          <button
            onClick={onClose}
            className="brutal-btn p-2 bg-card text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm text-center py-8">
            No scores yet. Play a game!
          </p>
        ) : (
          <div className="overflow-y-auto flex-1">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr
                    className="text-[10px] text-muted-foreground font-mono tracking-wider"
                    style={{ borderBottom: "2px solid hsl(var(--border))" }}
                  >
                    <th className="text-left pb-2 font-normal">#</th>
                    <th className="text-left pb-2 font-normal">STARTUP</th>
                    <th className="text-left pb-2 font-normal">FOUNDER</th>
                    <th className="text-left pb-2 font-normal">SCORE</th>
                    <th className="text-left pb-2 font-normal">OUTCOME</th>
                  </tr>
                </thead>
                <tbody className="stagger-children">
                  {leaderboard.map((record, index) => (
                    <tr
                      key={index}
                      className={`text-xs font-mono animate-fade-up ${index === 0 ? "bg-primary/10" : ""}`}
                      style={{
                        borderBottom: "1px solid hsl(var(--border) / 0.3)",
                      }}
                    >
                      <td
                        className={`py-2 font-display ${index === 0 ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {index + 1}
                      </td>
                      <td className="py-2 text-foreground font-medium max-w-[80px] truncate pr-2">
                        {record.startupName}
                      </td>
                      <td className="py-2 text-muted-foreground max-w-[80px] truncate pr-2">
                        {record.founderName}
                      </td>
                      <td className="py-2 text-foreground font-medium">
                        {record.score.toLocaleString()}
                      </td>
                      <td className="py-2">
                        <span
                          className={`brutal-tag ${OUTCOME_STYLES[record.outcome]} text-[8px]`}
                        >
                          {record.outcome.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardModal;
