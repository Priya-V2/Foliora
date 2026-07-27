import Link from "next/link";

const footerLinks = [
  "Changelog",
  "Status",
  "Privacy",
  "Terms",
  "Twitter",
  "GitHub",
];

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-surface border-t border-border">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="text-2xl font-bold text-text">Foliora</span>

          <p className="text-sm text-textMuted">
            © 2026 Foliora Inc. Built for developers.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-sm text-textMuted hover:text-primary hover:underline"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
