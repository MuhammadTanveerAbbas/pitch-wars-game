export type MarketEvent = {
  id: string;
  label: string;
  icon: string;
  effect: Partial<{ users: number; mrr: number; investorTrust: number; productScore: number }>;
};

export type Message = {
  role: 'founder' | 'investor';
  content: string;
  round: number;
};

export type GameStatus = 'start' | 'playing' | 'won' | 'bankrupt' | 'acquired';

export type GameState = {
  round: number;
  cash: number;
  mrr: number;
  users: number;
  burnRate: number;
  teamSize: number;
  productScore: number;
  investorTrust: number;
  currentEvent: MarketEvent | null;
  messages: Message[];
  gameStatus: GameStatus;
  isLoading: boolean;
  phase: 'event' | 'action' | 'responding' | 'done';
  paused: boolean;
  founderName: string;
  startupName: string;
  prevCash: number;
  prevMrr: number;
  prevUsers: number;
  prevBurnRate: number;
  advisorOffered: boolean;
  advisorAccepted: boolean;
  recommendedAction: PlayerAction | null;
  selectedAction: PlayerAction | null;
};

export type PlayerAction = 'ship' | 'market' | 'hire' | 'fundraise';

export type GameRecord = {
  founderName: string;
  startupName: string;
  outcome: 'survived' | 'bankrupt' | 'acquired';
  finalCash: number;
  finalMRR: number;
  finalUsers: number;
  roundsCompleted: number;
  victorTrust: number;
  score: number;
  date: string;
};

export type SavedGame = {
  gameState: GameState;
  messages: Message[];
  founderName: string;
  startupName: string;
  savedAt: number;
  savedRound: number;
};

export const MARKET_EVENTS: MarketEvent[] = [
  { id: 'competitor', icon: 'Flame', label: 'Competitor launched', effect: { users: -10, investorTrust: -5 } },
  { id: 'press', icon: 'Newspaper', label: 'TechCrunch mentioned you', effect: { users: 30, mrr: 500 } },
  { id: 'churn', icon: 'UserMinus', label: 'Enterprise client churned', effect: { mrr: -1000, investorTrust: -8 } },
  { id: 'viral', icon: 'Share2', label: 'Thread went viral', effect: { users: 50 } },
  { id: 'recession', icon: 'TrendingDown', label: 'Market downturn', effect: { mrr: -15, investorTrust: -10 } },
  { id: 'acqui', icon: 'Eye', label: 'Big co is watching you', effect: { investorTrust: 15 } },
  { id: 'bug', icon: 'Bug', label: 'Critical bug in prod', effect: { users: -20, productScore: -10 } },
  { id: 'partnership', icon: 'Handshake', label: 'Partnership opportunity', effect: { mrr: 800, investorTrust: 10 } },
];

export const ACTION_LABELS: Record<PlayerAction, { icon: string; label: string; description: string; cost: string; benefit: string }> = {
  ship: { icon: 'Rocket', label: 'Ship Feature', description: '+Product Score', cost: 'Cost: $3,000', benefit: '+Users, +Product' },
  market: { icon: 'Megaphone', label: 'Run Marketing', description: '+Users, +MRR', cost: 'Cost: $8,000', benefit: '+Growth' },
  hire: { icon: 'Users', label: 'Hire Developer', description: '+Team Efficiency', cost: '+$12k/mo burn', benefit: '+Capacity' },
  fundraise: { icon: 'DollarSign', label: 'Fundraise', description: 'Victor decides', cost: 'Needs Trust > 40', benefit: '+Cash' },
};

export const INITIAL_STATE: GameState = {
  round: 1,
  cash: 50000,
  mrr: 0,
  users: 0,
  burnRate: 5000,
  teamSize: 1,
  productScore: 10,
  investorTrust: 50,
  currentEvent: null,
  messages: [],
  gameStatus: 'start',
  isLoading: false,
  phase: 'event',
  paused: false,
  founderName: '',
  startupName: '',
  prevCash: 50000,
  prevMrr: 0,
  prevUsers: 0,
  prevBurnRate: 5000,
  advisorOffered: false,
  advisorAccepted: false,
  recommendedAction: null,
  selectedAction: null,
};

export const RANDOM_STARTUPS = ["Pivotly", "Burnr", "Churnbase", "Fundly", "MVPify", "Scaloor", "Launchify", "Pitchdeck.io"];
export const RANDOM_FOUNDERS = ["Bootstrapped Barry", "Runway Rachel", "Pivot Pete", "Series-A Sandra", "Churn Charlie"];

export function calcScore(state: { mrr: number; users: number; cash: number }) {
  return Math.floor(state.mrr * 10 + state.users * 2 + state.cash / 100);
}
