import React from "react";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
    {children}
  </span>
);

const DomainCard = ({ title, description, skills }: { title: string; description: string; skills: string[] }) => (
  <div className="rounded-2xl border border-brand-neutral-600 bg-brand-card p-6 hover:bg-brand-neutral-700/40 hover:border-brand-accent/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-accent/10">
    <h3 className="text-xl font-semibold text-brand-accent mb-3">{title}</h3>
    <p className="text-brand-neutral-200 mb-4">{description}</p>
    <div>
      <h4 className="text-sm font-medium text-brand-neutral-100 mb-2">Key Skills:</h4>
      <ul className="space-y-1">
        {skills.map((skill, index) => (
          <li key={index} className="text-sm text-brand-neutral-300">• {skill}</li>
        ))}
      </ul>
    </div>
  </div>
);

const domains = [
  {
    title: "Network Security",
    description: "Learn to secure network infrastructure, implement firewalls, and monitor network traffic for threats.",
    skills: ["Firewall configuration", "Network monitoring", "Intrusion detection", "VPN implementation"]
  },
  {
    title: "Identity and Access Management (IAM)",
    description: "Master user authentication, authorization, and access control systems.",
    skills: ["Multi-factor authentication", "Role-based access control", "Identity federation", "Privileged access management"]
  },
  {
    title: "Security Architecture and Engineering",
    description: "Design and implement secure systems and architectures from the ground up.",
    skills: ["Secure design principles", "Threat modeling", "Security controls", "Architecture reviews"]
  },
  {
    title: "Asset Security",
    description: "Protect organizational assets through proper classification, handling, and retention.",
    skills: ["Data classification", "Asset inventory", "Data lifecycle management", "Information handling"]
  },
  {
    title: "Security and Risk Management",
    description: "Develop comprehensive security programs and manage organizational risk.",
    skills: ["Risk assessment", "Security governance", "Compliance management", "Business continuity"]
  },
  {
    title: "Security Assessment and Testing",
    description: "Evaluate security controls through testing, auditing, and vulnerability assessments.",
    skills: ["Penetration testing", "Vulnerability scanning", "Security auditing", "Code review"]
  },
  {
    title: "Software Security",
    description: "Build secure applications and understand software vulnerabilities and mitigations.",
    skills: ["Secure coding", "Application security testing", "DevSecOps", "Software vulnerabilities"]
  },
  {
    title: "Security Operations",
    description: "Monitor, detect, and respond to security incidents in real-time environments.",
    skills: ["SIEM management", "Incident response", "Threat hunting", "Security monitoring"]
  }
];

export default function LearningPaths() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,212,255,0.15),transparent_60%)]" />
      
      <main className="container mx-auto px-6 py-10">
        <section>
          <Badge>Learning Tracks</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            Cybersecurity <span className="text-brand-accent">Learning Paths</span>
          </h1>
          <p className="mt-4 max-w-2xl text-brand-neutral-200">
            Master essential cybersecurity domains through hands-on labs, real-world scenarios, and guided learning tracks.
          </p>
        </section>

        <section className="mt-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain, index) => (
              <DomainCard key={index} {...domain} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
