"use client";

import { useState } from "react";
import { ExternalLink, FolderGit2, Plus } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Project, ProjectInput } from "@/types/portfolio.types";
import { normalizeUrl } from "../../utils/normalizeUrl";
import EntityCardActions from "./EntityCardActions";
import ProjectFormModal from "./ProjectFormModal";
import SectionCard from "./SectionCard";

interface ProjectsSectionProps {
  projects: Project[];
  onAdd: (input: ProjectInput) => Promise<void>;
  onEdit: (id: string, input: Partial<ProjectInput>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl bg-surfaceAlt p-4 sm:p-5">
      <p className="text-sm font-semibold text-text sm:text-base">{project.title}</p>

      {project.description && (
        <p className="mt-2 line-clamp-3 text-sm text-textMuted">{project.description}</p>
      )}

      {project.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      )}

      {(project.githubUrl || project.demoUrl) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.githubUrl && (
            <a
              href={normalizeUrl(project.githubUrl)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface py-2 text-xs font-medium text-text transition-colors hover:bg-background sm:text-sm"
            >
              <FaGithub size={14} aria-hidden="true" />
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={normalizeUrl(project.demoUrl)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface py-2 text-xs font-medium text-text transition-colors hover:bg-background sm:text-sm"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Demo
            </a>
          )}
        </div>
      )}

      <div className="mt-4">
        <EntityCardActions
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLabel={`Delete ${project.title}`}
        />
      </div>
    </div>
  );
}

export default function ProjectsSection({
  projects,
  onAdd,
  onEdit,
  onRemove,
}: ProjectsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editingProject = projects.find((item) => item.id === editingId) ?? null;
  const deletingProject = projects.find((item) => item.id === deletingId) ?? null;

  async function handleConfirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await onRemove(deletingId);
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <SectionCard
      icon={FolderGit2}
      title="Projects"
      meta={
        projects.length > 0
          ? `${projects.length} Project${projects.length === 1 ? "" : "s"} Found`
          : "Empty"
      }
    >
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects found"
          description="We couldn't find any projects in your resume. Add one manually."
          action={<Button onClick={() => setIsAdding(true)}>Add Project</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditingId(project.id)}
              onDelete={() => setDeletingId(project.id)}
            />
          ))}

          <Button
            variant="dashed"
            onClick={() => setIsAdding(true)}
            className="h-auto min-h-35 flex-col rounded-xl font-medium"
          >
            <Plus size={20} aria-hidden="true" />
            Add Another Project
          </Button>
        </div>
      )}

      <ProjectFormModal
        isOpen={isAdding || Boolean(editingProject)}
        onClose={() => {
          setIsAdding(false);
          setEditingId(null);
        }}
        project={editingProject}
        onSave={async (input) => {
          if (editingProject) {
            await onEdit(editingProject.id, input);
          } else {
            await onAdd(input);
          }
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingProject)}
        title="Delete this project?"
        description={
          deletingProject ? `"${deletingProject.title}" will be removed from your portfolio.` : ""
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </SectionCard>
  );
}
