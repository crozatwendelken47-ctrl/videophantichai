const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Figma",
  "Adobe XD",
];

export function About() {
  return (
    <section id="about" className="py-24 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left column - Sticky navigation */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              About<span className="text-primary">.</span>
            </h2>
            <div className="flex flex-col gap-2">
              <a
                href="#about"
                className="text-primary font-medium flex items-center gap-3"
              >
                <span className="w-12 h-px bg-primary" />
                ABOUT
              </a>
              <a
                href="#experience"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3"
              >
                <span className="w-8 h-px bg-muted-foreground" />
                EXPERIENCE
              </a>
              <a
                href="#work"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3"
              >
                <span className="w-8 h-px bg-muted-foreground" />
                PROJECTS
              </a>
            </div>
          </div>

          {/* Right column - Content */}
          <div className="space-y-8">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                I am a passionate developer and designer who loves crafting
                accessible, pixel-perfect user interfaces that blend thoughtful
                design with robust engineering. My favorite work lies at the
                intersection of design and development, creating experiences
                that not only look great but are meticulously built for
                performance and usability.
              </p>
              <p>
                Currently, I am focused on building accessible, human-centered
                products. I contribute to the creation and maintenance of UI
                components that power modern web applications, ensuring they
                meet web accessibility standards and best practices to deliver
                an inclusive user experience.
              </p>
              <p>
                In my spare time, I am usually exploring new technologies,
                reading about design systems, or working on personal projects
                that challenge me to learn something new.
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Technologies I work with
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-primary/20 hover:text-primary transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
