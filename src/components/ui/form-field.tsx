import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, hint, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-12 w-full rounded-xl border-2 border-border bg-surface px-4 text-sm text-foreground",
              "placeholder:text-muted-foreground/70",
              "transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
              icon && "pl-11",
              error && "border-danger/60 focus:border-danger focus:ring-danger/15",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export function PasswordInput(props: FormFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <FormField {...props} type={show ? "text" : "password"} className="pr-12" />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-[34px] flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
