import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "#f0b429",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
];
const PARTICLE_COUNT = 24;

type ParticleShape = "circle" | "square" | "triangle";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  size: number;
  shape: ParticleShape;
};

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 50 + (Math.random() - 0.5) * 20,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    angle: (index / PARTICLE_COUNT) * 360 + Math.random() * 30,
    speed: 60 + Math.random() * 80,
    size: 4 + Math.random() * 6,
    shape: (["circle", "square", "triangle"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));
}

const BURST_DURATION_MS = 1200;

const ConfettiBurst = ({
  active,
  onDone,
}: {
  active: boolean;
  onDone?: () => void;
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    setParticles(createParticles());
    const timer = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, BURST_DURATION_MS);
    return () => clearTimeout(timer);
    // onDone is intentionally excluded  it's a callback that shouldn't re-trigger the burst
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const translateX = Math.cos(radians) * particle.speed;
        const translateY = Math.sin(radians) * particle.speed - 40;

        return (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius:
                particle.shape === "circle"
                  ? "50%"
                  : particle.shape === "square"
                    ? "2px"
                    : "0",
              clipPath:
                particle.shape === "triangle"
                  ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                  : undefined,
              animation: `confetti-fly 1s ease-out forwards`,
              ["--tx" as string]: `${translateX}px`,
              ["--ty" as string]: `${translateY}px`,
              ["--rot" as string]: `${Math.random() * 720 - 360}deg`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ConfettiBurst;
