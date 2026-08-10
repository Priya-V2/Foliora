import { FileText } from "lucide-react";
import Badge, { badgeVariants } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { ResumeMetadata, ResumeStatus } from "@/types/resume.types";
import { type VariantProps } from "class-variance-authority";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const STATUS_LABEL: Record<ResumeStatus, string> = {
  UPLOADED: "Uploaded",
  PARSING: "Parsing…",
  PARSED: "Parsed Successfully",
  FAILED: "Parsing Failed",
};

const STATUS_VARIANT: Record<ResumeStatus, BadgeVariant> = {
  UPLOADED: "neutral",
  PARSING: "info",
  PARSED: "success",
  FAILED: "danger",
};

interface ResumeSummaryCardProps {
  resume: ResumeMetadata;
  skillsCount: number;
  projectsCount: number;
}

// Deliberately shows only real, backend-sourced facts (file name, parse
// status, live record counts) - no page count (not tracked by the Resume
// model) and no AI confidence score (not produced anywhere in the parsing
// pipeline). See Phase 4B "AI Confidence" requirement: never fabricate one.
export default function ResumeSummaryCard({
  resume,
  skillsCount,
  projectsCount,
}: ResumeSummaryCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5 sm:p-6">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <FileText size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text sm:text-base">
          {resume.fileName}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-textMuted sm:text-sm">
          <Badge variant={STATUS_VARIANT[resume.status]}>{STATUS_LABEL[resume.status]}</Badge>
          <span>{skillsCount} Skills</span>
          <span aria-hidden="true">·</span>
          <span>{projectsCount} Projects</span>
        </div>
      </div>
    </Card>
  );
}
