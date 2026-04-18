import { X } from "lucide-react";
import { GameRecord } from "@/types/game";
import { getCookieJSON } from "@/lib/cookies";

const OUTCOME_STYLES: Record<string, string> = {
  survived: "bg-secondary text-secondary-foreground",
  bankrupt: "bg-destructive text-destructive-foreground",
  acquired: "bg-primary text-primary-foreground",
};

const HistoryModal = ({ onClose }: { onClose: () => void }) => {
  const history: GameRecord[] = getCookieJSON<GameRecord[]>("pw_history") ?? [];

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
          <h2 className="font-display text-xl sm:text-2xl text-foreground">
            PITCH HISTORY
          </h2>
          <button
            onClick={onClose}
            className="brutal-btn p-2 bg-card text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {history.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm text-center py-8">
            No games played yet.
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
                    <th className="text-left pb-2 font-normal">STARTUP</th>
                    <th className="text-left pb-2 font-normal">OUTCOME</th>
                    <th className="text-left pb-2 font-normal">MRR</th>
                    <th className="text-left pb-2 font-normal">ROUNDS</th>
                    <th className="text-left pb-2 font-normal">DATE</th>
                  </tr>
                </thead>
                <tbody className="stagger-children">
                  {history.map((record, index) => (
                    <tr
                      key={index}
                      className="text-xs font-mono animate-fade-up"
                      style={{
                        borderBottom: "1px solid hsl(var(--border) / 0.3)",
                      }}
                    >
                      <td className="py-2 text-foreground font-medium max-w-[100px] truncate pr-2">
                        {record.startupName}
                      </td>
                      <td className="py-2">
                        <span
                          className={`brutal-tag ${OUTCOME_STYLES[record.outcome]} text-[8px]`}
                        >
                          {record.outcome.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 text-foreground">
                        ${record.finalMRR.toLocaleString()}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {record.roundsCompleted}/10
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {record.date}
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

export default HistoryModal;
