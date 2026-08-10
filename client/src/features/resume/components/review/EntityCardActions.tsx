import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";

interface EntityCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  deleteLabel: string;
  editLabel?: string;
}

// Shared Edit/Delete row reused by every record card (Experience, Education,
// Project, Certification, Achievement) so the interaction stays identical
// across sections.
export default function EntityCardActions({
  onEdit,
  onDelete,
  deleteLabel,
  editLabel = "Edit",
}: EntityCardActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        onClick={onEdit}
        className="h-auto rounded px-0 py-0 text-primary hover:bg-transparent hover:underline"
      >
        {editLabel}
      </Button>
      <IconButton aria-label={deleteLabel} variant="danger" onClick={onDelete}>
        <Trash2 size={15} aria-hidden="true" />
      </IconButton>
    </div>
  );
}
