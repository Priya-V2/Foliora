"use client";

import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import { Skill, SkillInput } from "@/types/portfolio.types";
import SectionCard from "./SectionCard";
import SkillFormModal from "./SkillFormModal";

interface SkillsSectionProps {
  skills: Skill[];
  onAdd: (input: SkillInput) => Promise<void>;
  onEdit: (id: string, input: Partial<SkillInput>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export default function SkillsSection({ skills, onAdd, onEdit, onRemove }: SkillsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const editingSkill = skills.find((item) => item.id === editingId) ?? null;

  return (
    <SectionCard
      icon={Zap}
      title="Skills"
      meta={skills.length > 0 ? `${skills.length} Skills Detected` : "Empty"}
    >
      {skills.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No skills found"
          description="We couldn't find any skills in your resume. Add your key skills manually."
          action={<Button onClick={() => setIsAdding(true)}>Add Skill</Button>}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => setEditingId(skill.id)}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Chip className="cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5">
                {skill.name}
              </Chip>
            </button>
          ))}
          <Button
            variant="dashed"
            onClick={() => setIsAdding(true)}
            className="h-auto gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium sm:text-sm"
          >
            <Plus size={14} aria-hidden="true" />
            Add Skill
          </Button>
        </div>
      )}

      <SkillFormModal
        isOpen={isAdding || Boolean(editingSkill)}
        onClose={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
        skill={editingSkill}
        onSave={async (input) => {
          if (editingSkill) {
            await onEdit(editingSkill.id, input);
          } else {
            await onAdd(input);
          }
        }}
        onDelete={
          editingSkill
            ? async () => {
                await onRemove(editingSkill.id);
                setEditingId(null);
              }
            : undefined
        }
      />
    </SectionCard>
  );
}
