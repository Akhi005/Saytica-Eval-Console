import { cn } from "@/lib/cn";

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-ink/65">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
