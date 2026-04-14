import { ExternalLink } from "lucide-react";

const experiences = [
  {
    period: "2024 - Present",
    title: "Senior Frontend Developer",
    company: "Tech Company",
    companyUrl: "#",
    description:
      "Build and maintain critical components used to construct modern web applications, working closely with cross-functional teams to implement and advocate for best practices in web accessibility.",
    skills: ["JavaScript", "TypeScript", "React", "Storybook"],
  },
  {
    period: "2022 - 2024",
    title: "Frontend Developer",
    company: "Digital Agency",
    companyUrl: "#",
    description:
      "Developed and styled interactive web applications for a diverse array of clients, including startups and established enterprises. Collaborated with designers and backend developers to deliver pixel-perfect implementations.",
    skills: ["React", "Next.js", "Tailwind CSS", "GraphQL"],
  },
  {
    period: "2020 - 2022",
    title: "UI/UX Designer & Developer",
    company: "Creative Studio",
    companyUrl: "#",
    description:
      "Designed and developed user interfaces for mobile and web applications. Created design systems and component libraries to ensure consistency across products.",
    skills: ["Figma", "Adobe XD", "CSS", "JavaScript"],
  },
  {
    period: "2019 - 2020",
    title: "Junior Developer",
    company: "Startup Inc",
    companyUrl: "#",
    description:
      "Assisted in developing and maintaining web applications. Gained experience in agile methodologies and collaborative software development.",
    skills: ["HTML", "CSS", "JavaScript", "Git"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-24 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Experience<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and the companies I have had the pleasure
            to work with.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <article
              key={exp.title + exp.company}
              className="group grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 p-6 rounded-2xl hover:bg-card/50 transition-colors duration-200"
            >
              {/* Period */}
              <div className="text-sm text-muted-foreground font-mono">
                {exp.period}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {exp.title} ·{" "}
                  <a
                    href={exp.companyUrl}
                    className="inline-flex items-center gap-1 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {exp.company}
                    <ExternalLink size={14} className="opacity-50" />
                  </a>
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
