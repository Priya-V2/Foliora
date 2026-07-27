import Image from "next/image";
import Link from "next/link";

type Template = {
  name: string;
  tagline: string;
  badge: string;
  badgeClass: string;
  src: string;
  alt: string;
};

const templates: Template[] = [
  {
    name: "Modern Engineering",
    tagline: "High density, terminal inspired.",
    badge: "Popular",
    badgeClass: "bg-success/10 text-success",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkupGPBY_BlFU8q5iN7LwbWMe_cpFvmjtIn7yT6CXXwh4YM2i4ofgp5Ua01Nh3BJT6OVHTq0MN7NkzbOXw6-KR3E2AuO8uNW7-oJ3bU1DIgJ8Hv-hGNx0L2Jwc2EJr_GdrZWwMISKJP0uq7uPegkDsHegoreQkTvkEmWAnWeg95N9KljH7B7Twq8rv46aKUmoJVtKWIm4pQUDd21M-O3vetp2AoYQHb43D8dT05K-6kWg5eTVjvFyRz2m5hOuF2cUFkJfwplutmg",
    alt: "Modern Engineering template preview",
  },
  {
    name: "Minimal Aesthetic",
    tagline: "Clean, airy, and focused on visuals.",
    badge: "New",
    badgeClass: "bg-surfaceAlt text-textMuted",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhIsY_aFwkDma1wfzMQI4t-6lIcCYJDtuuWb1TTaY0oS9AOC9uJBpVKiup1NFzBNSVZf7_0pb6SJ7rN5eho7JPBfJRxgZVRCMqAZwJ7yoLq_Y4hhJ_mcneN6FTq-SUiRkNj-bvAydzpqGaCfHaxDGcE_E5N6Rve1BlDdMXV0OMmjGLxY_L1O7I2u4QS_8SdNKsRExgvueN7iPKQAOAbamBf95gJ1ZLcvl3icgo_HqWZ1OdN2veWL0J6scnKk_6icWbVk1kwCf4Sw",
    alt: "Minimal Aesthetic template preview",
  },
];

export default function Templates() {
  return (
    <section className="py-16 bg-surface">
      <div className="container">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-bold text-text">
            Start with a template.
          </h2>

          <Link
            href="#"
            className="text-primary flex items-center gap-1 hover:underline"
          >
            View all templates
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {templates.map((t) => (
            <div key={t.name} className="group cursor-pointer">
              <div className="aspect-16/10 bg-surfaceAlt rounded-2xl border border-border overflow-hidden mb-6 relative">
                ...
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-semibold text-text">{t.name}</h4>

                  <p className="text-sm text-textMuted">{t.tagline}</p>
                </div>

                <span
                  className={`${
                    t.badge === "Popular"
                      ? "bg-success/10 text-success"
                      : "bg-surfaceAlt text-textMuted"
                  } px-2 py-1 rounded text-xs font-medium`}
                >
                  {t.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
