import React from "react";
import { Link } from "react-router-dom";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
    {children}
  </span>
);

const FrameworkCard = ({ title, description, category, useCase, comingSoon = true }: { 
  title: string; 
  description: string; 
  category: string;
  useCase: string; 
  comingSoon?: boolean;
}) => {
  return (
    <div className={`rounded-2xl border border-brand-neutral-600 bg-brand-card p-6 transition-all duration-200 ${comingSoon ? 'opacity-90' : 'hover:bg-brand-neutral-700/40 hover:border-brand-accent/40 hover:shadow-lg hover:shadow-brand-accent/10'}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-brand-accent leading-tight">{title}</h3>
        {comingSoon && (
          <span className="text-xs px-2 py-1 rounded-full bg-brand-neutral-600 text-brand-neutral-300 font-medium ml-2 flex-shrink-0">Coming Soon</span>
        )}
      </div>
      <p className="text-brand-neutral-200 mb-4 text-sm leading-relaxed">{description}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-accent">Category:</span>
          <span className="text-xs text-brand-neutral-300">{category}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-brand-accent flex-shrink-0">Use Case:</span>
          <span className="text-xs text-brand-neutral-300 leading-relaxed">{useCase}</span>
        </div>
      </div>
    </div>
  );
};

const frameworks = [
  {
    title: "NIST Cybersecurity Framework (CSF 2.0)",
    description: "Enterprise risk and governance scaffold with six core functions: Govern, Identify, Protect, Detect, Respond, and Recover.",
    category: "Risk Management & Governance",
    useCase: "Perfect for mapping your entire lab to business outcomes and establishing comprehensive cybersecurity programs."
  },
  {
    title: "ISO/IEC 27001 (+27002:2022)",
    description: "International standard for Information Security Management Systems (ISMS) with comprehensive control catalog.",
    category: "Management System Standard",
    useCase: "Aligns policy and procedures with technical labs and provides audit-ready documentation frameworks."
  },
  {
    title: "CIS Critical Security Controls v8",
    description: "Prioritized, actionable safeguards organized into Implementation Groups (IG1-IG3) for different organizational maturity levels.",
    category: "Technical Controls",
    useCase: "Easy to map to hands-on hardening exercises and provides clear implementation priorities."
  },
  {
    title: "NIST SP 800-53 Rev. 5",
    description: "Comprehensive security and privacy control catalog covering Access Control (AC), Audit (AU), Configuration Management (CM), and more.",
    category: "Control Catalog",
    useCase: "Excellent for tying each lab exercise to specific security controls and compliance requirements."
  },
  {
    title: "NIST SP 800-171 (Rev. 3)",
    description: "Framework for protecting Controlled Unclassified Information (CUI) in non-federal organizations and systems.",
    category: "Data Protection",
    useCase: "Directly relevant for SMBs and DoD contractors working with sensitive government information."
  },
  {
    title: "CMMC (DoD)",
    description: "Cybersecurity Maturity Model Certification built on NIST 800-171, providing capability levels for defense contractors.",
    category: "Maturity Model",
    useCase: "Frame labs as capability levels for defense contractors seeking DoD compliance and certification."
  },
  {
    title: "SOC 2 (AICPA TSC)",
    description: "Trust Services Criteria covering Security, Availability, Confidentiality, Processing Integrity, and Privacy principles.",
    category: "Trust & Assurance",
    useCase: "Essential for SaaS and service organizations focusing on customer data protection and evidence collection."
  },
  {
    title: "PCI DSS 4.0",
    description: "Payment Card Industry Data Security Standard providing baseline security requirements for payment processing.",
    category: "Industry Standard",
    useCase: "Use for network and application hardening labs, logging requirements, segmentation, and secure SDLC practices."
  },
  {
    title: "MITRE ATT&CK",
    description: "Adversary Tactics, Techniques, and Procedures (TTP) matrix providing a comprehensive knowledge base of cyber threats.",
    category: "Threat Intelligence",
    useCase: "Perfect for mapping hands-on attack and detection exercises (XSS, IDOR, auth abuse) to real-world TTPs."
  },
  {
    title: "OWASP ASVS (and/or SAMM)",
    description: "Application Security Verification Standard and Software Assurance Maturity Model for secure development practices.",
    category: "Application Security",
    useCase: "Ideal for anchoring web application security labs to concrete verification requirements and maturity goals."
  }
];

export default function CybersecurityFrameworks() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,212,255,0.15),transparent_60%)]" />
      
      <main className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        <section>
          <Badge>Industry Standards & Frameworks</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            Cybersecurity <span className="text-brand-accent">Frameworks</span>
          </h1>
          <p className="mt-4 max-w-4xl text-brand-neutral-200">
            Master industry-standard cybersecurity frameworks and compliance requirements. Map your lab exercises 
            to real-world governance, risk management, and technical control implementations.
          </p>
        </section>

        <section className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-neutral-50 mb-3">Framework Categories</h2>
            <p className="text-brand-neutral-300 mb-6">
              Each framework serves different organizational needs - from governance and risk management to technical controls and threat intelligence.
            </p>
            
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-brand-neutral-700/30 rounded-lg p-4 border border-brand-neutral-600">
                <h4 className="font-medium text-brand-accent mb-2 text-sm">Risk & Governance</h4>
                <p className="text-xs text-brand-neutral-300">NIST CSF, ISO 27001, CMMC</p>
              </div>
              <div className="bg-brand-neutral-700/30 rounded-lg p-4 border border-brand-neutral-600">
                <h4 className="font-medium text-brand-accent mb-2 text-sm">Technical Controls</h4>
                <p className="text-xs text-brand-neutral-300">CIS Controls, NIST 800-53, 800-171</p>
              </div>
              <div className="bg-brand-neutral-700/30 rounded-lg p-4 border border-brand-neutral-600">
                <h4 className="font-medium text-brand-accent mb-2 text-sm">Industry Standards</h4>
                <p className="text-xs text-brand-neutral-300">PCI DSS, SOC 2</p>
              </div>
              <div className="bg-brand-neutral-700/30 rounded-lg p-4 border border-brand-neutral-600">
                <h4 className="font-medium text-brand-accent mb-2 text-sm">Threat & App Security</h4>
                <p className="text-xs text-brand-neutral-300">MITRE ATT&CK, OWASP ASVS</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {frameworks.map((framework, index) => (
              <FrameworkCard key={index} {...framework} />
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-brand-neutral-600 bg-brand-neutral-700/30 p-8">
          <h3 className="text-xl font-semibold text-brand-neutral-50 mb-4">Framework Integration Benefits</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-brand-accent mb-2">Compliance Mapping</h4>
              <p className="text-sm text-brand-neutral-300">
                Connect hands-on lab exercises directly to specific framework controls and requirements for audit readiness.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-brand-accent mb-2">Career Relevance</h4>
              <p className="text-sm text-brand-neutral-300">
                Build practical experience with the same frameworks used by enterprise security teams and auditors.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-brand-accent mb-2">Structured Learning</h4>
              <p className="text-sm text-brand-neutral-300">
                Follow industry-proven methodologies for implementing comprehensive cybersecurity programs.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-brand-accent mb-2">Real-World Context</h4>
              <p className="text-sm text-brand-neutral-300">
                Understand how technical skills fit into broader organizational risk management and governance strategies.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
