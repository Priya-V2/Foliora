"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { Achievement, AchievementInput } from "@/types/portfolio.types";
import { AchievementFormValues, achievementSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";

interface AchievementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
  onSave: (input: AchievementInput) => Promise<void>;
}

function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export default function AchievementFormModal({
  isOpen,
  onClose,
  achievement,
  onSave,
}: AchievementFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AchievementFormValues>({ resolver: zodResolver(achievementSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      title: achievement?.title ?? "",
      description: achievement?.description ?? "",
      metric: achievement?.metric ?? "",
      achievedAt: toDateInputValue(achievement?.achievedAt),
    });
  }, [isOpen, achievement, reset]);

  async function onSubmit(values: AchievementFormValues) {
    await onSave(cleanFormInput(values) as AchievementInput);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={achievement ? "Edit Achievement" : "Add Achievement"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormInput label="Title" error={errors.title?.message} {...register("title")} />
        <Textarea
          label="Description (optional)"
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="Metric (optional)"
            placeholder="e.g. Top 1% contributor"
            error={errors.metric?.message}
            {...register("metric")}
          />
          <FormInput
            label="Date (optional)"
            type="date"
            error={errors.achievedAt?.message}
            {...register("achievedAt")}
          />
        </div>
      </form>
    </Modal>
  );
}
