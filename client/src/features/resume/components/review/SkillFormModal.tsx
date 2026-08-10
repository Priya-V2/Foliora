"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { SKILL_CATEGORY_OPTIONS, Skill, SkillInput } from "@/types/portfolio.types";
import { SkillFormValues, skillSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
  onSave: (input: SkillInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function SkillFormModal({
  isOpen,
  onClose,
  skill,
  onSave,
  onDelete,
}: SkillFormModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({ resolver: zodResolver(skillSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      name: skill?.name ?? "",
      category: skill?.category ?? "OTHER",
      proficiency: skill?.proficiency != null ? String(skill.proficiency) : "",
    });
  }, [isOpen, skill, reset]);

  async function onSubmit(values: SkillFormValues) {
    await onSave(
      cleanFormInput({
        ...values,
        proficiency: values.proficiency === "" ? undefined : Number(values.proficiency),
      }) as SkillInput,
    );
    onClose();
  }

  async function handleDelete() {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={skill ? "Edit Skill" : "Add Skill"}
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex w-full items-center justify-between">
          {onDelete ? (
            <Button
              variant="ghost"
              className="text-danger hover:bg-danger/10"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
              Save
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormInput label="Skill Name" error={errors.name?.message} {...register("name")} />
        <Select
          label="Category"
          options={SKILL_CATEGORY_OPTIONS}
          error={errors.category?.message}
          {...register("category")}
        />
        <FormInput
          label="Proficiency (1-5, optional)"
          type="number"
          min={1}
          max={5}
          error={errors.proficiency?.message}
          {...register("proficiency")}
        />
      </form>
    </Modal>
  );
}
