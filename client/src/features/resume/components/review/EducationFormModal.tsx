"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { Education, EducationInput } from "@/types/portfolio.types";
import { EducationFormValues, educationSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";

interface EducationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: Education | null;
  onSave: (input: EducationInput) => Promise<void>;
}

function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export default function EducationFormModal({
  isOpen,
  onClose,
  education,
  onSave,
}: EducationFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({ resolver: zodResolver(educationSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      institution: education?.institution ?? "",
      degree: education?.degree ?? "",
      fieldOfStudy: education?.fieldOfStudy ?? "",
      cgpa: education?.cgpa != null ? String(education.cgpa) : "",
      startDate: toDateInputValue(education?.startDate),
      endDate: toDateInputValue(education?.endDate),
      description: education?.description ?? "",
    });
  }, [isOpen, education, reset]);

  async function onSubmit(values: EducationFormValues) {
    await onSave(
      cleanFormInput({
        ...values,
        cgpa: values.cgpa === "" ? undefined : Number(values.cgpa),
      }) as EducationInput,
    );
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={education ? "Edit Education" : "Add Education"}
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
        <FormInput
          label="Institution"
          error={errors.institution?.message}
          {...register("institution")}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput label="Degree" error={errors.degree?.message} {...register("degree")} />
          <FormInput
            label="Field of Study"
            error={errors.fieldOfStudy?.message}
            {...register("fieldOfStudy")}
          />
        </div>
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
            error={errors.endDate?.message}
            {...register("endDate")}
          />
        </div>
        <FormInput
          label="CGPA (optional)"
          type="number"
          step="0.01"
          min={0}
          max={10}
          error={errors.cgpa?.message}
          {...register("cgpa")}
        />
        <Textarea
          label="Description"
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}
