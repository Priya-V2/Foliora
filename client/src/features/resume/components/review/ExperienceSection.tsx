"use client";

import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { Experience, ExperienceInput } from "@/types/portfolio.types";
import EntityCardActions from "./EntityCardActions";
import ExperienceFormModal from "./ExperienceFormModal";
import SectionCard from "./SectionCard";

interface ExperienceSectionProps {
  experiences: Experience[];
  onAdd: (input: ExperienceInput) => Promise<void>;
  onEdit: (id: string, input: Partial<ExperienceInput>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

function formatMonthYear(value: string): string {
  return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ExperienceCard({
  experience,
  onEdit,
  onDelete,
}: {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hasNotes = Boolean(experience.description) || experience.achievements.length > 0;

  return (
    <div className="rounded-xl bg-surfaceAlt p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text sm:text-base">{experience.role}</p>
          <p className="text-sm font-medium text-primary">{experience.company}</p>
        </div>
        <div className="shrink-0 text-xs text-textMuted sm:text-right sm:text-sm">
          <p>
            {formatMonthYear(experience.startDate)} —{" "}
            {experience.current
              ? "Present"
              : experience.endDate
                ? formatMonthYear(experience.endDate)
                : "—"}
          </p>
          {experience.location && <p>{experience.location}</p>}
        </div>
      </div>

      {hasNotes && (
        <ul className="mt-3 space-y-1.5 text-sm text-text">
          {experience.description && (
            <li className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{experience.description}</span>
            </li>
          )}
          {experience.achievements.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {experience.technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {experience.technologies.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      )}

      <div className="mt-4">
        <EntityCardActions
          editLabel="Edit Entry"
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLabel={`Delete ${experience.role} at ${experience.company}`}
        />
      </div>
    </div>
  );
}

export default function ExperienceSection({
  experiences,
  onAdd,
  onEdit,
  onRemove,
}: ExperienceSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editingExperience = experiences.find((item) => item.id === editingId) ?? null;
  const deletingExperience = experiences.find((item) => item.id === deletingId) ?? null;

  async function handleConfirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await onRemove(deletingId);
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <SectionCard
      icon={Briefcase}
      title="Experience"
      meta={
        experiences.length > 0
          ? `${experiences.length} Position${experiences.length === 1 ? "" : "s"} Found`
          : "Empty"
      }
    >
      {experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No work experience found"
          description="We couldn't find any work experience in your resume. You can add it manually."
          action={<Button onClick={() => setIsAdding(true)}>Add Experience</Button>}
        />
      ) : (
        <>
          <ol className="space-y-3 border-l-2 border-border pl-5 sm:pl-6">
            {experiences.map((experience, index) => (
              <li key={experience.id} className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-[27px] top-4 h-2.5 w-2.5 rounded-full sm:-left-[31px]",
                    index === 0 ? "bg-primary" : "bg-border",
                  )}
                />
                <ExperienceCard
                  experience={experience}
                  onEdit={() => setEditingId(experience.id)}
                  onDelete={() => setDeletingId(experience.id)}
                />
              </li>
            ))}
          </ol>

          <Button
            variant="dashed"
            fullWidth
            onClick={() => setIsAdding(true)}
            className="mt-4 h-auto rounded-xl py-3 font-medium"
          >
            <Plus size={16} aria-hidden="true" />
            Add Experience
          </Button>
        </>
      )}

      <ExperienceFormModal
        isOpen={isAdding || Boolean(editingExperience)}
        onClose={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
        experience={editingExperience}
        onSave={async (input) => {
          if (editingExperience) {
            await onEdit(editingExperience.id, input);
          } else {
            await onAdd(input);
          }
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingExperience)}
        title="Delete this experience?"
        description={
          deletingExperience
            ? `"${deletingExperience.role} at ${deletingExperience.company}" will be removed from your portfolio.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </SectionCard>
  );
}
