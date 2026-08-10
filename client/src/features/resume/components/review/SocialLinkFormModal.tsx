"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import { SocialLink, SocialLinkInput } from "@/types/portfolio.types";
import { SocialLinkFormValues, socialLinkSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";

interface SocialLinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  socialLink: SocialLink | null;
  onSave: (input: SocialLinkInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function SocialLinkFormModal({
  isOpen,
  onClose,
  socialLink,
  onSave,
  onDelete,
}: SocialLinkFormModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinkFormValues>({ resolver: zodResolver(socialLinkSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      platform: socialLink?.platform ?? "",
      url: socialLink?.url ?? "",
    });
  }, [isOpen, socialLink, reset]);

  async function onSubmit(values: SocialLinkFormValues) {
    await onSave(cleanFormInput(values) as SocialLinkInput);
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
      title={socialLink ? "Edit Social Link" : "Add Social Link"}
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
        <FormInput
          label="Platform"
          placeholder="e.g. GitHub, LinkedIn, Twitter"
          error={errors.platform?.message}
          {...register("platform")}
        />
        <FormInput
          label="URL"
          placeholder="https://github.com/username"
          error={errors.url?.message}
          {...register("url")}
        />
      </form>
    </Modal>
  );
}
