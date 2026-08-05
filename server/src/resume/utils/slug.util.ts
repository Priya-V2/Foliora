export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'portfolio';
}

interface SlugLookup {
  portfolio: {
    findUnique(args: { where: { slug: string } }): Promise<unknown>;
  };
}

// Appends -2, -3, ... until a free `Portfolio.slug` is found. Portfolio.slug
// is globally unique, so this has to check the database rather than just
// slugify the title. Accepts either PrismaService or a $transaction client -
// both structurally expose `.portfolio.findUnique`.
export async function generateUniqueSlug(
  prisma: SlugLookup,
  base: string,
): Promise<string> {
  const baseSlug = slugify(base);
  let candidate = baseSlug;
  let suffix = 1;

  while (await prisma.portfolio.findUnique({ where: { slug: candidate } })) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}
