import { Sparkles } from "lucide-react";
import ComingSoonPlaceholder from "@/features/onboarding/components/ComingSoonPlaceholder";

export default function Page() {
  return (
    <ComingSoonPlaceholder
      icon={Sparkles}
      title="Resume parsing is coming soon"
      description="Your resume has been uploaded and stored securely. Automatic extraction of your experience, education, and skills is being built next."
      showSpinner
    />
  );
}
