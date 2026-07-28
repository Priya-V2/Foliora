import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AuthProvider,
  PrismaClient,
  SkillCategory,
  Visibility,
} from '../src/generated/prisma';

const MINIMAL_TEMPLATE_ID = 'minimal';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@foliora.dev' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@foliora.dev',
      provider: AuthProvider.GITHUB,
      avatar: 'https://avatars.githubusercontent.com/u/9919',
    },
  });

  const template = await prisma.template.upsert({
    where: { id: MINIMAL_TEMPLATE_ID },
    update: {},
    create: {
      id: MINIMAL_TEMPLATE_ID,
      name: 'Minimal',
      slug: 'minimal',
      category: 'minimal',
    },
  });

  const portfolio = await prisma.portfolio.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      title: "Demo User's Portfolio",
      slug: 'demo-user',
      templateId: template.id,
      visibility: Visibility.PRIVATE,
    },
  });

  await prisma.skill.createMany({
    data: [
      {
        portfolioId: portfolio.id,
        name: 'TypeScript',
        category: SkillCategory.LANGUAGE,
        proficiency: 90,
        displayOrder: 0,
      },
      {
        portfolioId: portfolio.id,
        name: 'React',
        category: SkillCategory.FRONTEND,
        proficiency: 85,
        displayOrder: 1,
      },
      {
        portfolioId: portfolio.id,
        name: 'NestJS',
        category: SkillCategory.BACKEND,
        proficiency: 80,
        displayOrder: 2,
      },
      {
        portfolioId: portfolio.id,
        name: 'PostgreSQL',
        category: SkillCategory.DATABASE,
        proficiency: 75,
        displayOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  const existingExperience = await prisma.experience.findFirst({
    where: { portfolioId: portfolio.id, company: 'Foliora Labs' },
  });

  if (!existingExperience) {
    await prisma.experience.create({
      data: {
        portfolioId: portfolio.id,
        company: 'Foliora Labs',
        role: 'Senior Software Engineer',
        location: 'Remote',
        description:
          'Led development of the core portfolio builder platform, focusing on editor performance and API design.',
        technologies: ['TypeScript', 'NestJS', 'React', 'PostgreSQL'],
        achievements: [
          'Reduced editor load time by 40% through code-splitting',
          'Designed the multi-tenant portfolio publishing pipeline',
        ],
        startDate: new Date('2023-01-15'),
        current: true,
        displayOrder: 0,
      },
    });
  }

  const existingProject = await prisma.project.findFirst({
    where: { portfolioId: portfolio.id, title: 'Foliora Portfolio Builder' },
  });

  if (!existingProject) {
    await prisma.project.create({
      data: {
        portfolioId: portfolio.id,
        title: 'Foliora Portfolio Builder',
        description:
          'A visual, no-code portfolio builder that imports resume and GitHub data to generate a publishable site.',
        techStack: ['Next.js', 'NestJS', 'Prisma', 'PostgreSQL'],
        githubUrl: 'https://github.com/demo-user/foliora',
        demoUrl: 'https://demo-user.foliora.app',
        featured: true,
        displayOrder: 0,
      },
    });
  }

  console.log('Seed complete:', { userId: user.id, portfolioId: portfolio.id });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
