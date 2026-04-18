type Props = { size?: number; className?: string };

export default function PitchWarsLogo({ size = 24, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pitch Wars logo"
    >
      <rect width="64" height="64" fill="#080b12" />
      <rect x="2" y="2" width="60" height="60" stroke="#f0b429" strokeWidth="3" fill="none" />
      <polygon points="38,4 22,34 30,34 26,60 46,28 37,28 44,4" fill="#f0b429" />
    </svg>
  );
}
