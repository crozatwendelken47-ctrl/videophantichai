"use client";

import { Github, Linkedin, Mail, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_50%)] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-accent)_0%,_transparent_50%)] opacity-5" />

      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Text */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-primary font-mono text-sm tracking-wider">
              Hello, I am
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              Creative Designer
              <span className="block text-primary">&amp; Developer</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              I build accessible, pixel-perfect digital experiences for the
              web. My work lies at the intersection of design and development,
              creating experiences that not only look great but are
              meticulously built for performance and usability.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#work"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Right side - Profile/Visual */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative">
            <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-card border border-border flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-primary">5+</div>
                  <div className="text-muted-foreground text-sm">
                    Years of Experience
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/10 border border-primary/20" />
            <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-accent/10 border border-accent/20" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center pt-2">
          <div className="w-1 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </section>
  );
}
