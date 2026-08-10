"use client";

import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Certification, CertificationInput } from "@/types/portfolio.types";
import { normalizeUrl } from "../../utils/normalizeUrl";
import CertificationFormModal from "./CertificationFormModal";
import EntityCardActions from "./EntityCardActions";
import SectionCard from "./SectionCard";

interface CertificationsSectionProps {
  certifications: Certification[];
  onAdd: (input: CertificationInput) => Promise<void>;
  onEdit: (id: string, input: Partial<CertificationInput>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: {
  certification: Certification;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl bg-surfaceAlt p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text sm:text-base">{certification.title}</p>
          <p className="text-sm font-medium text-primary">{certification.issuer}</p>
        </div>
        {certification.issueDate && (
          <p className="shrink-0 text-xs text-textMuted sm:text-sm">
            {formatDate(certification.issueDate)}
          </p>
        )}
      </div>

      {(certification.credentialId || certification.credentialUrl) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-textMuted">
          {certification.credentialId && <span>ID: {certification.credentialId}</span>}
          {certification.credentialUrl && (
            <a
              href={normalizeUrl(certification.credentialUrl)}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline"
            >
              View credential
            </a>
          )}
        </div>
      )}

      <div className="mt-4">
        <EntityCardActions
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLabel={`Delete ${certification.title}`}
        />
      </div>
    </div>
  );
}

export default function CertificationsSection({
  certifications,
  onAdd,
  onEdit,
  onRemove,
}: CertificationsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editingCertification = certifications.find((item) => item.id === editingId) ?? null;
  const deletingCertification = certifications.find((item) => item.id === deletingId) ?? null;

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
      icon={ShieldCheck}
      title="Certifications"
      meta={certifications.length > 0 ? `${certifications.length} Found` : "Empty"}
    >
      {certifications.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No certifications found in your resume."
          description="Add any certifications you'd like to showcase on your portfolio."
          action={<Button onClick={() => setIsAdding(true)}>Add Certification</Button>}
        />
      ) : (
        <>
          <div className="space-y-3">
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
                onEdit={() => setEditingId(certification.id)}
                onDelete={() => setDeletingId(certification.id)}
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
            Add Certification
          </Button>
        </>
      )}

      <CertificationFormModal
        isOpen={isAdding || Boolean(editingCertification)}
        onClose={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
        certification={editingCertification}
        onSave={async (input) => {
          if (editingCertification) {
            await onEdit(editingCertification.id, input);
          } else {
            await onAdd(input);
          }
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingCertification)}
        title="Delete this certification?"
        description={
          deletingCertification
            ? `"${deletingCertification.title}" will be removed from your portfolio.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </SectionCard>
  );
}
