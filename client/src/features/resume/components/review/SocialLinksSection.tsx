"use client";

import { useState } from "react";
import { Link2 as LinkIcon, Pencil, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { SocialLink, SocialLinkInput } from "@/types/portfolio.types";
import { normalizeUrl } from "../../utils/normalizeUrl";
import { getSocialPlatformIcon } from "../../utils/socialPlatformIcon";
import SectionCard from "./SectionCard";
import SocialLinkFormModal from "./SocialLinkFormModal";

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onAdd: (input: SocialLinkInput) => Promise<void>;
  onEdit: (id: string, input: Partial<SocialLinkInput>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export default function SocialLinksSection({
  socialLinks,
  onAdd,
  onEdit,
  onRemove,
}: SocialLinksSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const editingLink = socialLinks.find((item) => item.id === editingId) ?? null;

  return (
    <SectionCard
      icon={LinkIcon}
      title="Social Links"
      meta={socialLinks.length > 0 ? `${socialLinks.length} Links Found` : "Empty"}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {socialLinks.map((link) => {
          const PlatformIcon = getSocialPlatformIcon(link.platform);

          return (
            <div key={link.id} className="flex items-center gap-3 rounded-xl bg-surfaceAlt p-3.5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-text"
                aria-hidden="true"
              >
                <PlatformIcon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-textMuted">{link.platform}</p>
                <a
                  href={normalizeUrl(link.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-sm font-medium text-text hover:text-primary"
                >
                  {link.url}
                </a>
              </div>
              <IconButton
                onClick={() => setEditingId(link.id)}
                aria-label={`Edit ${link.platform} link`}
                className="hover:bg-surface hover:text-primary"
              >
                <Pencil size={14} aria-hidden="true" />
              </IconButton>
            </div>
          );
        })}

        <Button
          variant="dashed"
          onClick={() => setIsAdding(true)}
          className="h-auto rounded-xl p-3.5 font-medium"
        >
          <Plus size={16} aria-hidden="true" />
          Add Social Link
        </Button>
      </div>

      <SocialLinkFormModal
        isOpen={isAdding || Boolean(editingLink)}
        onClose={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
        socialLink={editingLink}
        onSave={async (input) => {
          if (editingLink) {
            await onEdit(editingLink.id, input);
          } else {
            await onAdd(input);
          }
        }}
        onDelete={
          editingLink
            ? async () => {
                await onRemove(editingLink.id);
                setEditingId(null);
              }
            : undefined
        }
      />
    </SectionCard>
  );
}
