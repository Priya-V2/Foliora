import { CreateProjectDto } from '../../portfolio/dto/project.dto';

// Matches CreateProjectDto's own @MaxLength/@ArrayMaxSize constraints so
// GitHub-sourced values that exceed them are truncated instead of failing
// validation deep inside the import flow.
export function mapRepositoryToProjectDto(repo: {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  techStack: string[];
}): CreateProjectDto {
  return {
    title: repo.name.slice(0, 150),
    description: repo.description?.slice(0, 2000),
    techStack: repo.techStack.slice(0, 30),
    githubUrl: repo.url.slice(0, 300),
    demoUrl: repo.homepage ? repo.homepage.slice(0, 300) : undefined,
  };
}
