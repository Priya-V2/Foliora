"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { Experience, ExperienceInput } from "@/types/portfolio.types";
import { ExperienceFormValues, experienceSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";
import TagListInput from "./TagListInput";

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience | null;
  onSave: (input: ExperienceInput) => Promise<void>;
}

function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export default function ExperienceFormModal({
  isOpen,
  onClose,
  experience,
  onSave,
}: ExperienceFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { technologies: [], achievements: [], current: false },
  });

  const isCurrent = watch("current");

  useEffect(() => {
    if (!isOpen) return;
    reset({
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      location: experience?.location ?? "",
      description: experience?.description ?? "",
      technologies: experience?.technologies ?? [],
      achievements: experience?.achievements ?? [],
      startDate: toDateInputValue(experience?.startDate),
      endDate: toDateInputValue(experience?.endDate),
      current: experience?.current ?? false,
    });
  }, [isOpen, experience, reset]);

  async function onSubmit(values: ExperienceFormValues) {
    await onSave(
      cleanFormInput({
        ...values,
        endDate: values.current ? undefined : values.endDate,
      }) as ExperienceInput,
    );
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={experience ? "Edit Experience" : "Add Experience"}
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput label="Company" error={errors.company?.message} {...register("company")} />
          <FormInput label="Role" error={errors.role?.message} {...register("role")} />
        </div>
        <FormInput label="Location" error={errors.location?.message} {...register("location")} />
        <Textarea
          label="Description"
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />

        <Controller
          control={control}
          name="technologies"
          render={({ field }) => (
            <TagListInput
              label="Technologies"
              values={field.value ?? []}
              onChange={field.onChange}
              placeholder="e.g. React (press Enter)"
            />
          )}
        />
        <Controller
          control={control}
          name="achievements"
          render={({ field }) => (
            <TagListInput
              label="Key Achievements"
              values={field.value ?? []}
              onChange={field.onChange}
              placeholder="Add an achievement (press Enter)"
            />
          )}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="Start Date"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <FormInput
            label="End Date"
            type="date"
            disabled={isCurrent}
            error={errors.endDate?.message}
            {...register("endDate")}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/40"
            {...register("current")}
          />
          I currently work here
        </label>
      </form>
    </Modal>
  );
}
