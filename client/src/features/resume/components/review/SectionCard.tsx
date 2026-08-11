"use client";

import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  meta?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

// The one section-header/collapsible-body shell reused by every Review
// Parsed Data section (Personal Info, Experience, Education, Skills,
// Projects, Certifications, Achievements, Social Links) - see reference
// screenshots. Built on the generic Card primitive.
export default function SectionCard({
  icon: Icon,
  title,
  meta,
  defaultOpen = true,
  children,
  className,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surfaceAlt/40 md:px-6 md:py-5"
      >
        <span className="flex items-center gap-2.5 text-base font-semibold text-text sm:text-lg">
          <Icon size={18} className="text-primary" aria-hidden="true" />
          {title}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {meta && (
            <span className="hidden text-xs text-textMuted sm:inline">{meta}</span>
          )}
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={cn(
              "shrink-0 text-textMuted transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-border px-5 py-5 md:px-6 md:py-6">
          {children}
        </div>
      )}
    </Card>
  );
}
