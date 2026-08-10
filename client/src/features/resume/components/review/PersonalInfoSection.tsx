"use client";

import { useState } from "react";
import { User } from "lucide-react";
import Button from "@/components/ui/Button";
import { PersonalInfo, UpdatePersonalInfoInput } from "@/types/portfolio.types";
import PersonalInfoFormModal from "./PersonalInfoFormModal";
import SectionCard from "./SectionCard";

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo | null;
  onSave: (input: UpdatePersonalInfoInput) => Promise<void>;
}

const FIELD_KEYS: (keyof PersonalInfo)[] = [
  "fullName",
  "role",
  "headline",
  "bio",
  "location",
  "email",
  "phone",
  "website",
  "availability",
  "yearsOfExperience",
];

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-textMuted">{label}</p>
      <p className="mt-1 text-sm text-text">
        {value === null || value === "" ? (
          <span className="text-textMuted">Not provided</span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

export default function PersonalInfoSection({
  personalInfo,
  onSave,
}: PersonalInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const filledCount = personalInfo
    ? FIELD_KEYS.filter((key) => personalInfo[key] !== null && personalInfo[key] !== "").length
    : 0;

  return (
    <SectionCard
      icon={User}
      title="Personal Information"
      meta={`${filledCount} of ${FIELD_KEYS.length} Fields Provided`}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <Field label="Full Name" value={personalInfo?.fullName ?? null} />
        <Field label="Location" value={personalInfo?.location ?? null} />
        <Field label="Professional Title" value={personalInfo?.role ?? null} />
        <Field label="Availability" value={personalInfo?.availability ?? null} />
        <Field label="Email" value={personalInfo?.email ?? null} />
        <Field label="Phone" value={personalInfo?.phone ?? null} />
        <Field label="Website" value={personalInfo?.website ?? null} />
        <Field
          label="Years of Experience"
          value={personalInfo?.yearsOfExperience ?? null}
        />
        <Field label="Headline" value={personalInfo?.headline ?? null} className="sm:col-span-2" />
        <Field label="Bio" value={personalInfo?.bio ?? null} className="sm:col-span-2" />
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={() => setIsEditing(true)}>
          Edit Details
        </Button>
      </div>

      <PersonalInfoFormModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        personalInfo={personalInfo}
        onSave={onSave}
      />
    </SectionCard>
  );
}
