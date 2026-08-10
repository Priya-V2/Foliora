"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { PersonalInfo, UpdatePersonalInfoInput } from "@/types/portfolio.types";
import { PersonalInfoFormValues, personalInfoSchema } from "../../schemas/review.schema";
import { cleanFormInput } from "../../utils/cleanFormInput";

interface PersonalInfoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PersonalInfo | null;
  onSave: (input: UpdatePersonalInfoInput) => Promise<void>;
}

export default function PersonalInfoFormModal({
  isOpen,
  onClose,
  personalInfo,
  onSave,
}: PersonalInfoFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormValues>({ resolver: zodResolver(personalInfoSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      fullName: personalInfo?.fullName ?? "",
      role: personalInfo?.role ?? "",
      headline: personalInfo?.headline ?? "",
      bio: personalInfo?.bio ?? "",
      location: personalInfo?.location ?? "",
      email: personalInfo?.email ?? "",
      phone: personalInfo?.phone ?? "",
      website: personalInfo?.website ?? "",
      availability: personalInfo?.availability ?? "",
      yearsOfExperience:
        personalInfo?.yearsOfExperience != null ? String(personalInfo.yearsOfExperience) : "",
    });
  }, [isOpen, personalInfo, reset]);

  async function onSubmit(values: PersonalInfoFormValues) {
    await onSave(
      cleanFormInput({
        ...values,
        yearsOfExperience:
          values.yearsOfExperience === "" ? undefined : Number(values.yearsOfExperience),
      }),
    );
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Personal Information"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
          <FormInput
            label="Professional Title"
            error={errors.role?.message}
            {...register("role")}
          />
        </div>
        <FormInput label="Headline" error={errors.headline?.message} {...register("headline")} />
        <Textarea label="Bio" rows={4} error={errors.bio?.message} {...register("bio")} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput label="Location" error={errors.location?.message} {...register("location")} />
          <FormInput
            label="Availability"
            error={errors.availability?.message}
            {...register("availability")}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormInput label="Phone" error={errors.phone?.message} {...register("phone")} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput label="Website" error={errors.website?.message} {...register("website")} />
          <FormInput
            label="Years of Experience"
            type="number"
            min={0}
            max={80}
            error={errors.yearsOfExperience?.message}
            {...register("yearsOfExperience")}
          />
        </div>
      </form>
    </Modal>
  );
}
