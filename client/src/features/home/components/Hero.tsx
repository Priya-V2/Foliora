import Image from "next/image";
import { FaRegCheckCircle } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="container mb-16">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text leading-[1.05]">
            Build a developer portfolio without designing one.
          </h1>

          <p className="text-lg text-textMuted max-w-lg">
            Import projects from GitHub, customize your content, and publish a
            professional portfolio in minutes.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button className="bg-primary text-white px-12 py-4 rounded-xl font-semibold shadow-card hover:scale-[1.02] transition-all">
              Get Started Free
            </button>

            <button className="border border-border px-12 py-4 rounded-xl font-semibold text-text hover:bg-surfaceAlt transition-all">
              View Templates
            </button>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-textMuted">
            {[
              "No coding required",
              "GitHub integration",
              "Free to get started",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <FaRegCheckCircle className="text-success" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 w-full relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-primary to-success rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />

          <div className="relative bg-surface rounded-2xl border border-border overflow-hidden shadow-elevated">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7pYG2U-mNmj6ruUCRBkDj87z9N-O_AVtICm_kgWq9RSDsv9Q6ws9XizhN0cuxafg5s0_7J7WGkFOCMFVRdDt5dpIa0LG1wwF19Tlfl1GijDBjxJTY-nuwtcfjz02y4Y8uOag5TGSs46jD6tOqFNl0BLbeLaClG98SiIqjSRXAq0Tk45h5afrUxWOjbFjMKdV3M1I0t-7XEANe4DwcLI8c3ZQx2oRHI_eRUALt5pG-rzc1lM7I24DIpsmnC-U-M73QK9QMweLsjQ"
              alt="Foliora Editor Showcase"
              width={800}
              height={600}
              className="w-full aspect-4/3 object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
