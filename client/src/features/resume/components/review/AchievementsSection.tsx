"use client";

import { useState } from "react";
import { Award, Plus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Achievement, AchievementInput } from "@/types/portfolio.types";
import AchievementFormModal from "./AchievementFormModal";
import EntityCardActions from "./EntityCardActions";
import SectionCard from "./SectionCard";

interface AchievementsSectionProps {
  achievements: Achievement[];
  onAdd: (input: AchievementInput) => Promise<void>;
  onEdit: (id: string, input: Partial<AchievementInput>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function AchievementCard({
  achievement,
  onEdit,
  onDelete,
}: {
  achievement: Achievement;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl bg-surfaceAlt p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text sm:text-base">{achievement.title}</p>
          {achievement.description && (
            <p className="mt-1 text-sm text-textMuted">{achievement.description}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
          {achievement.metric && <Badge variant="info">{achievement.metric}</Badge>}
          {achievement.achievedAt && (
            <p className="text-xs text-textMuted">{formatDate(achievement.achievedAt)}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <EntityCardActions
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLabel={`Delete ${achievement.title}`}
        />
      </div>
    </div>
  );
}

// Not part of the reference screenshots - added per Phase 4B scope, since
// the Achievement model and resume-extraction pipeline already support it.
// Kept visually consistent with Certifications/Education.
export default function AchievementsSection({
  achievements,
  onAdd,
  onEdit,
  onRemove,
}: AchievementsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editingAchievement = achievements.find((item) => item.id === editingId) ?? null;
  const deletingAchievement = achievements.find((item) => item.id === deletingId) ?? null;

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
      icon={Award}
      title="Achievements"
      meta={achievements.length > 0 ? `${achievements.length} Found` : "Empty"}
    >
      {achievements.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No achievements found in your resume."
          description="Add notable awards, recognitions, or highlights to showcase on your portfolio."
          action={<Button onClick={() => setIsAdding(true)}>Add Achievement</Button>}
        />
      ) : (
        <>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onEdit={() => setEditingId(achievement.id)}
                onDelete={() => setDeletingId(achievement.id)}
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
            Add Achievement
          </Button>
        </>
      )}

      <AchievementFormModal
        isOpen={isAdding || Boolean(editingAchievement)}
        onClose={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
        achievement={editingAchievement}
        onSave={async (input) => {
          if (editingAchievement) {
            await onEdit(editingAchievement.id, input);
          } else {
            await onAdd(input);
          }
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingAchievement)}
        title="Delete this achievement?"
        description={
          deletingAchievement
            ? `"${deletingAchievement.title}" will be removed from your portfolio.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </SectionCard>
  );
}
