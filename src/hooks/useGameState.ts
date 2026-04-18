import { useState, useCallback, useEffect } from "react";
import {
  GameState,
  INITIAL_STATE,
  MARKET_EVENTS,
  MarketEvent,
  PlayerAction,
  Message,
  SavedGame,
  GameRecord,
  calcScore,
} from "@/types/game";
import {
  getCookieJSON,
  setCookieJSON,
  removeCookie,
  setCookie,
} from "@/lib/cookies";

const SAVE_KEY = "pw_save";
const HISTORY_KEY = "pw_history";
const LEADERBOARD_KEY = "pw_leaderboard";
const FOUNDER_NAME_KEY = "pw_founder_name";
const STARTUP_NAME_KEY = "pw_startup_name";

/** Maximum entries stored in history and leaderboard */
const MAX_RECORDS = 10;

function randomEvent(): MarketEvent {
  return MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getRecommendedAction(state: GameState): PlayerAction {
  if (state.cash < 15000 && state.investorTrust > 40) return "fundraise";
  if (state.productScore < 30) return "ship";
  if (state.users < 50) return "market";
  if (state.teamSize < 3 && state.cash > 40000) return "hire";
  return "ship";
}

/**
 * Applies a player action to the current state, returning a new state and a
 * human-readable summary. Burn rate and MRR are applied at the end of each action.
 */
function applyAction(
  state: GameState,
  action: PlayerAction,
): { state: GameState; summary: string } {
  const base: GameState = {
    ...state,
    prevCash: state.cash,
    prevMrr: state.mrr,
    prevUsers: state.users,
    prevBurnRate: state.burnRate,
  };

  let delta: Partial<GameState> = {};
  let summary = "";

  switch (action) {
    case "ship": {
      const productBoost = 10 + Math.floor(Math.random() * 11);
      const userGain = Math.max(
        1,
        Math.floor(base.users * (0.05 + Math.random() * 0.1)) + 5,
      );
      delta = {
        productScore: clamp(base.productScore + productBoost, 0, 100),
        users: base.users + userGain,
        cash: base.cash - 3000,
      };
      summary = `Shipped a feature. Product score +${productBoost}, users +${userGain}. Spent $3K.`;
      break;
    }
    case "market": {
      const userGain = Math.max(
        5,
        Math.floor(base.users * (0.2 + Math.random() * 0.2)) + 10,
      );
      const mrrGain = Math.floor(userGain * 2.5);
      delta = {
        users: base.users + userGain,
        mrr: base.mrr + mrrGain,
        cash: base.cash - 8000,
      };
      summary = `Ran marketing. Users +${userGain}, MRR +$${mrrGain}. Spent $8K.`;
      break;
    }
    case "hire": {
      const newTeamSize = base.teamSize + 1;
      const newBurnRate = base.burnRate + 12000;
      delta = { teamSize: newTeamSize, burnRate: newBurnRate };
      summary = `Hired a developer. Team is now ${newTeamSize}. Burn +$12K/mo.`;
      break;
    }
    case "fundraise": {
      summary = "Pitched Victor Chen for funding.";
      break;
    }
  }

  const afterAction: GameState = { ...base, ...delta };
  const finalCash = afterAction.cash - afterAction.burnRate + afterAction.mrr;

  return { state: { ...afterAction, cash: finalCash }, summary };
}

function loadSave(): SavedGame | null {
  return getCookieJSON<SavedGame>(SAVE_KEY);
}

function saveToDisk(state: GameState): void {
  const save: SavedGame = {
    gameState: state,
    messages: state.messages,
    founderName: state.founderName,
    startupName: state.startupName,
    savedAt: Date.now(),
    savedRound: state.round,
  };
  setCookieJSON(SAVE_KEY, save, 7);
}

function clearSave(): void {
  removeCookie(SAVE_KEY);
}

function addToHistory(state: GameState): void {
  const history: GameRecord[] = getCookieJSON<GameRecord[]>(HISTORY_KEY) ?? [];
  const outcome =
    state.gameStatus === "won"
      ? "survived"
      : state.gameStatus === "acquired"
        ? "acquired"
        : "bankrupt";

  const record: GameRecord = {
    founderName: state.founderName,
    startupName: state.startupName,
    outcome,
    finalCash: state.cash,
    finalMRR: state.mrr,
    finalUsers: state.users,
    roundsCompleted: state.round,
    victorTrust: state.investorTrust,
    score: calcScore(state),
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  };

  history.unshift(record);
  setCookieJSON(HISTORY_KEY, history.slice(0, MAX_RECORDS), 365);

  const leaderboard: GameRecord[] =
    getCookieJSON<GameRecord[]>(LEADERBOARD_KEY) ?? [];
  leaderboard.push(record);
  leaderboard.sort((a, b) => b.score - a.score);
  setCookieJSON(LEADERBOARD_KEY, leaderboard.slice(0, MAX_RECORDS), 365);
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  useEffect(() => {
    if (state.gameStatus === "playing" && state.phase === "event") {
      saveToDisk(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.round, state.phase]);

  const startGame = useCallback((founderName: string, startupName: string) => {
    const event = randomEvent();
    const newState: GameState = {
      ...INITIAL_STATE,
      gameStatus: "playing",
      currentEvent: event,
      phase: "event",
      founderName,
      startupName,
    };
    setCookie(FOUNDER_NAME_KEY, founderName, 365);
    setCookie(STARTUP_NAME_KEY, startupName, 365);
    setState(newState);
  }, []);

  const resumeGame = useCallback((save: SavedGame) => {
    setState(save.gameState);
  }, []);

  const acknowledgeEvent = useCallback(() => {
    setState((prev) => {
      const shouldOfferAdvisor =
        prev.round === 5 && prev.investorTrust > 60 && !prev.advisorOffered;
      const recommendedAction =
        shouldOfferAdvisor || prev.advisorAccepted
          ? getRecommendedAction(prev)
          : null;
      return {
        ...prev,
        phase: "action",
        recommendedAction,
        advisorOffered: shouldOfferAdvisor ? true : prev.advisorOffered,
      };
    });
  }, []);

  const acceptAdvisor = useCallback(() => {
    setState((prev) => ({
      ...prev,
      advisorAccepted: true,
      recommendedAction: getRecommendedAction(prev),
    }));
  }, []);

  const declineAdvisor = useCallback(() => {
    setState((prev) => ({
      ...prev,
      advisorOffered: true,
      recommendedAction: null,
    }));
  }, []);

  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  const performAction = useCallback(async (action: PlayerAction) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      phase: "responding",
      selectedAction: action,
    }));

    const currentState = await new Promise<GameState>((resolve) => {
      setState((prev) => {
        resolve(prev);
        return prev;
      });
    });

    const { state: nextState, summary } = applyAction(currentState, action);
    const founderMessage: Message = {
      role: "founder",
      content: summary,
      round: currentState.round,
    };
    const updatedMessages = [...currentState.messages, founderMessage];

    if (nextState.cash <= 0) {
      const finalState: GameState = {
        ...nextState,
        messages: updatedMessages,
        gameStatus: "bankrupt",
        isLoading: false,
        phase: "done",
        selectedAction: null,
      };
      setState((prev) => ({ ...prev, ...finalState }));
      clearSave();
      addToHistory(finalState);
      return;
    }

    if (nextState.mrr >= 15000) {
      const finalState: GameState = {
        ...nextState,
        messages: updatedMessages,
        gameStatus: "acquired",
        isLoading: false,
        phase: "done",
        selectedAction: null,
      };
      setState((prev) => ({ ...prev, ...finalState }));
      clearSave();
      addToHistory(finalState);
      return;
    }

    try {
      const aiMessages = updatedMessages.map((m) => ({
        role: m.role === "founder" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }));

      const founderNameStr = currentState.founderName || "the founder";
      const startupNameStr = currentState.startupName || "the startup";

      aiMessages.push({
        role: "user" as const,
        content: `Round ${currentState.round}/10.
Founder's action: ${summary}
Market event: ${currentState.currentEvent?.label ?? "None"}

Current metrics:
- Cash: $${nextState.cash.toLocaleString()}
- MRR: $${nextState.mrr.toLocaleString()}
- Users: ${nextState.users}
- Burn Rate: $${nextState.burnRate.toLocaleString()}/mo
- Team Size: ${nextState.teamSize}
- Product Score: ${nextState.productScore}/100
- Your trust in this founder: ${nextState.investorTrust}/100
${action === "fundraise" ? (nextState.investorTrust < 40 ? "\nThe founder asked to fundraise but trust is too low. PASS immediately." : "\nThe founder is asking you to INVEST. Make a clear INVEST or PASS decision with a specific dollar amount if investing.") : ""}
Respond as Victor Chen. The founder's name is ${founderNameStr} and their startup is called ${startupNameStr}.`,
      });

      const resp = await fetch("/api/investor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: aiMessages }),
      });

      const respData = await resp.json();
      let investorText = "Victor stares at his phone and says nothing.";
      if (respData?.content) investorText = respData.content;

      let cashBonus = 0;
      if (
        action === "fundraise" &&
        investorText.toUpperCase().includes("INVEST") &&
        !investorText.toUpperCase().includes("PASS")
      ) {
        const dollarMatch = investorText.match(/\$(\d[\d,]*)/);
        if (dollarMatch) cashBonus = parseInt(dollarMatch[1].replace(/,/g, ""));
        else cashBonus = 25000 + Math.floor(nextState.investorTrust * 500);
      }

      const investorMessage: Message = {
        role: "investor",
        content: investorText,
        round: currentState.round,
      };
      const isLastRound = currentState.round >= 10;

      const updatedState: Partial<GameState> = {
        ...nextState,
        cash: nextState.cash + cashBonus,
        messages: [...updatedMessages, investorMessage],
        round: isLastRound ? currentState.round : currentState.round + 1,
        gameStatus: isLastRound ? "won" : "playing",
        isLoading: false,
        phase: isLastRound ? "done" : "event",
        currentEvent: isLastRound ? currentState.currentEvent : randomEvent(),
        selectedAction: null,
        recommendedAction: null,
      };

      setState((prev) => {
        const merged = { ...prev, ...updatedState } as GameState;
        if (isLastRound) {
          clearSave();
          addToHistory(merged);
        }
        return merged;
      });
    } catch {
      const fallbackMessage: Message = {
        role: "investor",
        content:
          '*Victor glances at his Bloomberg terminal.* "Interesting quarter. Let\'s see how you play the next round."',
        round: currentState.round,
      };
      const isLastRound = currentState.round >= 10;

      setState((prev) => {
        const merged: GameState = {
          ...prev,
          ...nextState,
          messages: [...updatedMessages, fallbackMessage],
          round: isLastRound ? prev.round : currentState.round + 1,
          gameStatus: isLastRound ? "won" : "playing",
          isLoading: false,
          phase: isLastRound ? "done" : "event",
          currentEvent: isLastRound ? prev.currentEvent : randomEvent(),
          selectedAction: null,
        };
        if (isLastRound) {
          clearSave();
          addToHistory(merged);
        }
        return merged;
      });
    }
  }, []);

  const resetGame = useCallback(() => {
    clearSave();
    setState(INITIAL_STATE);
  }, []);

  return {
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
  };
}
