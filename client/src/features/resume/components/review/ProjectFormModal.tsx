"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { Project, ProjectInput } from "@/types/portfolio.types";
import { ProjectFormValues, projectSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";
import TagListInput from "./TagListInput";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (input: ProjectInput) => Promise<void>;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
  onSave,
}: ProjectFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { techStack: [], featured: false },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      title: project?.title ?? "",
      description: project?.description ?? "",
      techStack: project?.techStack ?? [],
      githubUrl: project?.githubUrl ?? "",
      demoUrl: project?.demoUrl ?? "",
      imageUrl: project?.imageUrl ?? "",
      featured: project?.featured ?? false,
    });
  }, [isOpen, project, reset]);

  async function onSubmit(values: ProjectFormValues) {
    await onSave(cleanFormInput(values) as ProjectInput);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? "Edit Project" : "Add Project"}
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
        <FormInput label="Project Title" error={errors.title?.message} {...register("title")} />
        <Textarea
          label="Description"
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />

        <Controller
          control={control}
          name="techStack"
          render={({ field }) => (
            <TagListInput
              label="Tech Stack"
              values={field.value ?? []}
              onChange={field.onChange}
              placeholder="e.g. Next.js (press Enter)"
            />
          )}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="GitHub URL"
            error={errors.githubUrl?.message}
            {...register("githubUrl")}
          />
          <FormInput label="Demo URL" error={errors.demoUrl?.message} {...register("demoUrl")} />
        </div>
        <FormInput
          label="Image URL (optional)"
          error={errors.imageUrl?.message}
          {...register("imageUrl")}
        />

        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/40"
            {...register("featured")}
          />
          Feature this project
        </label>
      </form>
    </Modal>
  );
}
