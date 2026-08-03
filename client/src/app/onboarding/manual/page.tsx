import { PenLine } from "lucide-react";
import ComingSoonPlaceholder from "@/features/onboarding/components/ComingSoonPlaceholder";

export default function Page() {
  return (
    <ComingSoonPlaceholder
      icon={PenLine}
      title="Manual portfolio building is coming soon"
      description="The step-by-step portfolio editor is still being built. Try uploading your resume instead to get started faster."
    />
  );
}
