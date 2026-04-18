import { useEffect, useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import LandingPage from "@/components/game/LandingPage";
import GameHeader from "@/components/game/GameHeader";
import MetricsDashboard from "@/components/game/MetricsDashboard";
import MarketEventBanner from "@/components/game/MarketEventBanner";
import ActionButtons from "@/components/game/ActionButtons";
import InvestorChat from "@/components/game/InvestorChat";
import GameOverScreen from "@/components/game/GameOverScreen";
import PauseOverlay from "@/components/game/PauseOverlay";
import AdvisorBanner from "@/components/game/AdvisorBanner";
import HistoryModal from "@/components/game/HistoryModal";
import LeaderboardModal from "@/components/game/LeaderboardModal";
import ConfettiBurst from "@/components/game/ConfettiBurst";
import { playCoinSound } from "@/hooks/useSoundEffects";

const KEYBOARD_ACTION_MAP: Record<
  string,
  "ship" | "market" | "hire" | "fundraise"
> = {
  "1": "ship",
  "2": "market",
  "3": "hire",
  "4": "fundraise",
};

const Index = () => {
  const {
    state,
    startGame,
    resumeGame,
    acknowledgeEvent,
    performAction,
    resetGame,
    togglePause,
    acceptAdvisor,
    declineAdvisor,
    loadSave,
  } = useGameState();

  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [investConfetti, setInvestConfetti] = useState(false);

  useEffect(() => {
    if (state.messages.length === 0) return;
    const lastMessage = state.messages[state.messages.length - 1];
    const isInvestment =
      lastMessage.role === "investor" &&
      lastMessage.content.toUpperCase().includes("INVEST") &&
      !lastMessage.content.toUpperCase().includes("PASS");
    if (isInvestment) {
      playCoinSound();
      setInvestConfetti(true);
    }
  }, [state.messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameStatus !== "playing") return;

      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (state.paused || state.phase !== "action" || state.isLoading) return;

      const action = KEYBOARD_ACTION_MAP[e.key];
      if (action) performAction(action);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    state.gameStatus,
    state.paused,
    state.phase,
    state.isLoading,
    togglePause,
    performAction,
  ]);

  if (state.gameStatus === "start") {
    return (
      <LandingPage
        onStart={startGame}
        onResume={resumeGame}
        savedGame={loadSave()}
      />
    );
  }

  const isGameOver =
    state.gameStatus === "won" ||
    state.gameStatus === "bankrupt" ||
    state.gameStatus === "acquired";
  const showAdvisor =
    state.round === 5 &&
    state.advisorOffered &&
    !state.advisorAccepted &&
    state.phase === "action" &&
    state.recommendedAction === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConfettiBurst
        active={investConfetti}
        onDone={() => setInvestConfetti(false)}
      />

      <GameHeader
        round={state.round}
        status={state.gameStatus}
        startupName={state.startupName}
        cash={state.cash}
        burnRate={state.burnRate}
        mrr={state.mrr}
        onPause={togglePause}
        onHistory={() => setShowHistory(true)}
        onLeaderboard={() => setShowLeaderboard(true)}
        onHome={resetGame}
      />

      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 overflow-y-auto relative md:border-r-[3px] md:border-border">
          {state.paused && (
            <PauseOverlay onResume={togglePause} onQuit={resetGame} />
          )}

          <MetricsDashboard
            cash={state.cash}
            mrr={state.mrr}
            users={state.users}
            burnRate={state.burnRate}
            prevCash={state.prevCash}
            prevMrr={state.prevMrr}
            prevUsers={state.prevUsers}
            teamSize={state.teamSize}
            productScore={state.productScore}
            investorTrust={state.investorTrust}
          />

          {state.phase === "event" && state.currentEvent && (
            <MarketEventBanner
              event={state.currentEvent}
              onAcknowledge={acknowledgeEvent}
            />
          )}

          {showAdvisor && (
            <AdvisorBanner
              onAccept={acceptAdvisor}
              onDecline={declineAdvisor}
            />
          )}

          {state.phase === "action" && (
            <ActionButtons
              onAction={performAction}
              disabled={state.isLoading}
              investorTrust={state.investorTrust}
              cash={state.cash}
              recommendedAction={state.recommendedAction}
              selectedAction={state.selectedAction}
            />
          )}

          {state.phase === "responding" && (
            <div className="text-center py-8 animate-fade-up">
              <div className="brutal-card-static inline-block px-6 py-3">
                <p className="font-mono text-xs text-muted-foreground shimmer">
                  Victor is reviewing your move...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col min-h-[280px] md:min-h-0 border-t-[3px] border-border md:border-t-0">
          <InvestorChat
            messages={state.messages}
            isLoading={state.isLoading}
            investorTrust={state.investorTrust}
          />
        </div>
      </div>

      {isGameOver && <GameOverScreen state={state} onRestart={resetGame} />}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};

export default Index;
