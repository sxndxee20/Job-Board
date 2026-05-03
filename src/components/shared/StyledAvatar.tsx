import { cn } from "@/lib/utils";

const avatarStyles = [
  "bg-gradient-primary text-white ring-2 ring-primary/25",
  "bg-primary-soft text-primary ring-2 ring-primary/20",
  "bg-accent/20 text-accent ring-2 ring-accent/25",
  "bg-success/20 text-success ring-2 ring-success/25",
];

function hashSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function getInitials(text: string) {
  return text.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function StyledAvatar({
  seed,
  label,
  className,
}: {
  seed: string;
  label: string;
  className?: string;
}) {
  const idx = hashSeed(seed || label) % avatarStyles.length;
  return (
    <div className={cn("flex items-center justify-center rounded-full font-bold", avatarStyles[idx], className)}>
      {getInitials(label || "U")}
    </div>
  );
}
