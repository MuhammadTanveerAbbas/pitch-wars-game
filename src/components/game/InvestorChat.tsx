import { useEffect, useRef, memo } from "react";
import { Message } from "@/types/game";
import { playTypingSound } from "@/hooks/useSoundEffects";

const TypingIndicator = () => {
  useEffect(() => {
    const interval = setInterval(() => playTypingSound(), 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-3 animate-fade-up">
      <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center text-[10px] font-display flex-shrink-0">
        VC
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-mono">
          Victor is analyzing
        </span>
        <div className="flex gap-1">
          <span className="typing-dot w-1.5 h-1.5 bg-foreground" />
          <span className="typing-dot w-1.5 h-1.5 bg-foreground" />
          <span className="typing-dot w-1.5 h-1.5 bg-foreground" />
        </div>
      </div>
    </div>
  );
};

type Props = {
  messages: Message[];
  isLoading: boolean;
  investorTrust: number;
};

const InvestorChat = memo(({ messages, isLoading, investorTrust }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b-[3px] border-border px-4 py-3 bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-foreground text-background flex items-center justify-center font-display text-sm flex-shrink-0">
            VC
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm text-foreground">Victor Chen</p>
            <p className="text-[10px] text-muted-foreground font-mono">
              Seed Investor · Apex Ventures
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">
            TRUST
          </span>
          <div
            className="flex-1 h-2 bg-muted overflow-hidden"
            style={{ border: "1px solid hsl(var(--border))" }}
          >
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${investorTrust}%` }}
            />
          </div>
          <span className="text-[10px] text-foreground font-mono font-medium flex-shrink-0">
            {investorTrust}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-background">
        {messages.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-xs text-center mt-8 font-mono">
            Victor is waiting for your first move...
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "founder" ? "justify-end animate-slide-right" : "justify-start animate-slide-left"}`}
          >
            <div
              className={`max-w-[85%] p-3 text-sm
                ${
                  msg.role === "founder"
                    ? "brutal-card-static bg-muted"
                    : "brutal-card-static border-l-4"
                }
              `}
              style={
                msg.role === "investor"
                  ? { borderLeftColor: "hsl(var(--primary))" }
                  : undefined
              }
            >
              {msg.role === "investor" && (
                <p className="font-display text-[10px] text-primary mb-1">
                  Victor · R{msg.round}
                </p>
              )}
              {msg.role === "founder" && (
                <p className="font-display text-[10px] text-muted-foreground mb-1">
                  You · R{msg.round}
                </p>
              )}
              <p
                className={`whitespace-pre-wrap text-xs leading-relaxed ${msg.role === "investor" ? "font-mono text-foreground" : "font-body text-muted-foreground"}`}
              >
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {investorTrust <= 0 && messages.length > 0 && (
          <p className="text-center text-xs text-muted-foreground font-mono italic mt-4 animate-fade-up">
            Victor Chen has left the chat.
          </p>
        )}

        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
});

InvestorChat.displayName = "InvestorChat";
export default InvestorChat;
