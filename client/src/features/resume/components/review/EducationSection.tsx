"use client";

import { useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Education, EducationInput } from "@/types/portfolio.types";
import EducationFormModal from "./EducationFormModal";
import EntityCardActions from "./EntityCardActions";
import SectionCard from "./SectionCard";

interface EducationSectionProps {
  educations: Education[];
  onAdd: (input: EducationInput) => Promise<void>;
  onEdit: (id: string, input: Partial<EducationInput>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

function formatYear(value: string): string {
  return new Date(value).getFullYear().toString();
}

function EducationCard({
  education,
  onEdit,
  onDelete,
}: {
  education: Education;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl bg-surfaceAlt p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text sm:text-base">
            {education.degree}
            {education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ""}
          </p>
          <p className="text-sm font-medium text-primary">{education.institution}</p>
        </div>
        <div className="shrink-0 text-xs text-textMuted sm:text-right sm:text-sm">
          <p>
            {formatYear(education.startDate)} —{" "}
            {education.endDate ? formatYear(education.endDate) : "Present"}
          </p>
          {education.cgpa !== null && <p>CGPA: {education.cgpa}</p>}
        </div>
      </div>

      {education.description && (
        <p className="mt-3 text-sm text-text">{education.description}</p>
      )}

      <div className="mt-4">
        <EntityCardActions
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLabel={`Delete ${education.degree} at ${education.institution}`}
        />
      </div>
    </div>
  );
}

export default function EducationSection({
  educations,
  onAdd,
  onEdit,
  onRemove,
}: EducationSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editingEducation = educations.find((item) => item.id === editingId) ?? null;
  const deletingEducation = educations.find((item) => item.id === deletingId) ?? null;

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
      icon={GraduationCap}
      title="Education"
      meta={
        educations.length > 0
          ? `${educations.length} Record${educations.length === 1 ? "" : "s"} Found`
          : "Empty"
      }
    >
      {educations.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education found"
          description="We couldn't find any education history in your resume. You can add it manually."
          action={<Button onClick={() => setIsAdding(true)}>Add Education</Button>}
        />
      ) : (
        <>
          <div className="space-y-3">
            {educations.map((education) => (
              <EducationCard
                key={education.id}
                education={education}
                onEdit={() => setEditingId(education.id)}
                onDelete={() => setDeletingId(education.id)}
              />
            ))}
          </div>

          <Button
            variant="dashed"
            fullWidth
            onClick={() => setIsAdding(true)}
            className="mt-4 h-auto rounded-xl py-3 font-medium"
          >
            <Plus size={16} aria-hidden="true" />
            Add Education
          </Button>
        </>
      )}

      <EducationFormModal
        isOpen={isAdding || Boolean(editingEducation)}
        onClose={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
        education={editingEducation}
        onSave={async (input) => {
          if (editingEducation) {
            await onEdit(editingEducation.id, input);
          } else {
            await onAdd(input);
          }
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingEducation)}
        title="Delete this education record?"
        description={
          deletingEducation
            ? `"${deletingEducation.degree} at ${deletingEducation.institution}" will be removed from your portfolio.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </SectionCard>
  );
}
