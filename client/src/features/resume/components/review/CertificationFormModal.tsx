"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import { Certification, CertificationInput } from "@/types/portfolio.types";
import { CertificationFormValues, certificationSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";

interface CertificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification: Certification | null;
  onSave: (input: CertificationInput) => Promise<void>;
}

function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export default function CertificationFormModal({
  isOpen,
  onClose,
  certification,
  onSave,
}: CertificationFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormValues>({ resolver: zodResolver(certificationSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      title: certification?.title ?? "",
      issuer: certification?.issuer ?? "",
      credentialId: certification?.credentialId ?? "",
      credentialUrl: certification?.credentialUrl ?? "",
      issueDate: toDateInputValue(certification?.issueDate),
      logoUrl: certification?.logoUrl ?? "",
    });
  }, [isOpen, certification, reset]);

  async function onSubmit(values: CertificationFormValues) {
    await onSave(cleanFormInput(values) as CertificationInput);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certification ? "Edit Certification" : "Add Certification"}
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
        <FormInput label="Issuer" error={errors.issuer?.message} {...register("issuer")} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="Credential ID (optional)"
            error={errors.credentialId?.message}
            {...register("credentialId")}
          />
          <FormInput
            label="Issue Date"
            type="date"
            error={errors.issueDate?.message}
            {...register("issueDate")}
          />
        </div>
        <FormInput
          label="Credential URL (optional)"
          error={errors.credentialUrl?.message}
          {...register("credentialUrl")}
        />
        <FormInput
          label="Logo URL (optional)"
          error={errors.logoUrl?.message}
          {...register("logoUrl")}
        />
      </form>
    </Modal>
  );
}
