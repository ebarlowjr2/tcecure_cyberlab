import React from "react";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
    {children}
  </span>
);

const ProjectCard = ({ title, description, duration, difficulty }: { 
  title: string; 
  description: string; 
  duration: string; 
  difficulty: string; 
}) => (
  <div className="rounded-2xl border border-brand-neutral-600 bg-brand-card p-6 hover:bg-brand-neutral-700/40 hover:border-brand-accent/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-accent/10">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xl font-semibold text-brand-accent">{title}</h3>
      <span className="text-xs px-2 py-1 rounded-full bg-brand-accent/20 text-brand-accent font-medium">{difficulty}</span>
    </div>
    <p className="text-brand-neutral-200 mb-4">{description}</p>
    <div className="text-sm text-brand-neutral-300">
      <span>Duration: {duration}</span>
    </div>
  </div>
);

const projects = [
  {
    title: "Running SCAP Scans",
    description: "Learn to perform security compliance scanning using SCAP tools and interpret results for vulnerability assessment.",
    duration: "2-3 hours",
    difficulty: "Beginner"
  },
  {
    title: "STIG Remediation",
    description: "Master the Security Technical Implementation Guide (STIG) process for hardening systems and ensuring compliance.",
    duration: "3-4 hours",
    difficulty: "Intermediate"
  },
  {
    title: "Automated Remediation with Ansible",
    description: "Build automation playbooks to remediate security vulnerabilities and maintain system compliance at scale.",
    duration: "4-5 hours",
    difficulty: "Intermediate"
  },
  {
    title: "WebApp Scanning",
    description: "Conduct comprehensive web application security testing using automated tools and manual techniques.",
    duration: "3-4 hours",
    difficulty: "Beginner"
  }
];

export default function StarterProjects() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,212,255,0.15),transparent_60%)]" />
      
      <main className="container mx-auto px-6 py-10">
        <section>
          <Badge>Self-Paced Labs</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            Starter <span className="text-brand-accent">Projects</span>
          </h1>
          <p className="mt-4 max-w-2xl text-brand-neutral-200">
            Build practical cybersecurity skills through hands-on projects and real-world scenarios.
          </p>
        </section>

        <section className="mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
