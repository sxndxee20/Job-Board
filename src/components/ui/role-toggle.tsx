import { cn } from "@/lib/utils";
import type { Role } from "@/context/AppContext";

export function RoleToggle({
  value,
  onChange,
}: {
  value: Role;
  onChange: (r: Role) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
      {(["seeker", "admin"] as const).map((r) => {
        const active = value === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={cn(
              "h-10 rounded-xl text-sm font-semibold transition-all",
              active
                ? "bg-surface text-primary shadow-card"
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
