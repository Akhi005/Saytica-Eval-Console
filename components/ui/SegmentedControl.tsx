import { cn } from "@/lib/cn";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "rounded-full border border-ink/8 bg-white/90 p-1 shadow-sm",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <div
        className="grid rounded-full bg-mist p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              className={cn(
                "flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition duration-200",
                isActive
                  ? "bg-white text-ink shadow-sm ring-1 ring-accent/20"
                  : "text-ink/60 hover:bg-white/60 hover:text-ink",
              )}
              onClick={() => onChange(option.value)}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
