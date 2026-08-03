import { cn } from "@/lib/utils";
import ContentContainer from "./ContentContainer";

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

// Standard shell for app pages: full-height background, an optional
// PageHeader, and a ContentContainer-bound main area with one consistent
// top/bottom rhythm. No page should hand-roll `min-h-screen bg-background`
// or main padding anymore.
export default function PageLayout({
  children,
  header,
  className,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {header}
      <main className={cn("py-8 sm:py-12 md:py-16 lg:py-20", className)}>
        <ContentContainer>{children}</ContentContainer>
      </main>
    </div>
  );
}
