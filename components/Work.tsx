"use client";

import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A modern e-commerce solution with real-time inventory, seamless checkout, and responsive design built for scale.",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    image: "/projects/ecommerce.jpg",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Dashboard Analytics",
    description:
      "Interactive data visualization dashboard with real-time updates, custom charts, and comprehensive reporting tools.",
    tags: ["React", "D3.js", "Node.js", "PostgreSQL"],
    image: "/projects/dashboard.jpg",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Mobile Banking App",
    description:
      "Secure mobile banking application featuring biometric authentication, transaction history, and money transfers.",
    tags: ["React Native", "TypeScript", "Firebase"],
    image: "/projects/banking.jpg",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "AI Content Generator",
    description:
      "AI-powered content creation tool that helps marketers generate engaging copy, social posts, and blog articles.",
    tags: ["Next.js", "OpenAI", "Prisma", "Vercel"],
    image: "/projects/ai-content.jpg",
    liveUrl: "#",
    githubUrl: "#",
  },
];

export function Work() {
  return (
    <section id="work" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Selected Work<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of projects I have worked on, showcasing my skills in
            design and development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Project Image Placeholder */}
              <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                <div className="text-6xl font-bold text-primary/20">
                  0{index + 1}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={project.githubUrl}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github size={18} />
                    </a>
                    <a
                      href={project.liveUrl}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View ${project.title} live`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary/50 text-muted-foreground text-xs rounded-full font-mono"
                    >
                      {tag}
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
