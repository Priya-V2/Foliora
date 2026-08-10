import { Sparkles } from "lucide-react";
import ComingSoonPlaceholder from "@/features/onboarding/components/ComingSoonPlaceholder";

export default function Page() {
  return (
    <ComingSoonPlaceholder
      icon={Sparkles}
      title="Portfolio enhancement is coming soon"
      description="AI-powered content suggestions and template selection are still being built. Your reviewed data has been saved."
    />
  );
}
