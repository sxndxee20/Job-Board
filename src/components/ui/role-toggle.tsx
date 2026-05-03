import { cn } from "@/lib/utils";
import type { Role } from "@/context/AppContext";

export function RoleToggle({
  value,
  onChange,
}: {
  value: Role;
  onChange: (r: Role) => void;
}) {
  const isSeeker = value === "seeker";
  return (
    <div className="relative grid grid-cols-2 rounded-2xl border border-border bg-muted p-1.5">
      <span
        className={cn(
          "absolute top-1.5 h-10 w-[calc(50%-0.375rem)] rounded-xl bg-gradient-primary shadow-soft transition-transform duration-300",
          isSeeker ? "translate-x-0" : "translate-x-[calc(100%+0.25rem)]"
        )}
      />
      {(["seeker", "admin"] as const).map((r) => {
        const active = value === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={cn(
              "relative z-10 h-10 rounded-xl text-sm font-semibold transition-all",
              active
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r === "seeker" ? "Job Seeker" : "Admin"}
          </button>
        );
      })}
    </div>
  );
}
