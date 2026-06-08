"use client";

import { Search } from "lucide-react";

export function ModelSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block w-full xl:max-w-md">
      <span className="sr-only">Find a model</span>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
        aria-hidden="true"
      />
      <input
        className="min-h-11 w-full rounded-xl border border-ink/10 bg-field/60 py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 transition focus:border-accent/40 focus:bg-white"
        placeholder="Search models or providers…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}