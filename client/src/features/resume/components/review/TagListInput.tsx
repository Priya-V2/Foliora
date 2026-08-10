"use client";

import { useState } from "react";
import Chip from "@/components/ui/Chip";

interface TagListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

// Editable list-of-strings input for technologies/achievements/tech-stack
// fields - lets the user add/remove individual items instead of editing a
// raw JSON array (see Phase 4B requirements for Experience/Project forms).
export default function TagListInput({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter",
}: TagListInputProps) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text">{label}</label>
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surfaceAlt px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
        {values.map((value) => (
          <Chip key={value} onRemove={() => onChange(values.filter((item) => item !== value))}>
            {value}
          </Chip>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commitDraft();
            } else if (event.key === "Backspace" && !draft && values.length > 0) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={commitDraft}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent py-0.5 text-sm text-text placeholder-textMuted focus:outline-none"
        />
      </div>
    </div>
  );
}
