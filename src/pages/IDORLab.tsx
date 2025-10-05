import React from "react";
import { Link } from "react-router-dom";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
    {children}
  </span>
);

export default function IDORLab() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,212,255,0.15),transparent_60%)]" />
      
      <main className="container mx-auto px-6 py-10 max-w-4xl">
        <div className="mb-6">
          <Link 
            to="/pen-testing-labs" 
            className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            ← Back to Pen Testing Labs
          </Link>
        </div>
        
        <section>
          <Badge>Lab 3</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            IDOR on <span className="text-brand-accent">REST Endpoints</span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent font-medium">Intermediate</span>
            <span className="text-sm text-brand-neutral-300">OWASP A01: Broken Access Control</span>
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-brand-neutral-600 bg-brand-card p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Goal</h3>
              <p className="text-brand-neutral-200">Access or modify another user's data by changing an ID.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target</h3>
              <p className="text-brand-neutral-200">Basket, order history, address endpoints (watch ZAP for /rest/.../&#123;id&#125;)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Tools Required</h3>
              <p className="text-brand-neutral-200">ZAP, Multiple browser profiles</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target Server</h3>
              <p className="text-brand-neutral-200">Juicebox-001 (On-premises)</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-brand-neutral-50 mb-4">Step-by-Step Instructions</h3>
            <div className="space-y-4 text-brand-neutral-200">
              <div>
                <p className="mb-2"><strong>1. Victim (User B):</strong> Log in and add an item to the basket (or create an address).</p>
              </div>
              <div>
                <p className="mb-2"><strong>2.</strong> In ZAP, with User B active, locate the relevant API responses (e.g., GET /rest/basket/5 or GET /api/Orders). Note IDs returned.</p>
              </div>
              <div>
                <p className="mb-2"><strong>3. Attacker (User A):</strong> Log in separately (or use a different browser profile).</p>
              </div>
              <div>
                <p className="mb-2"><strong>4.</strong> From the attacker's session, find a similar request in ZAP (e.g., your own basket or order).</p>
              </div>
              <div>
                <p className="mb-2"><strong>5.</strong> Send attacker's request to Repeater and change the ID to the victim's ID (e.g., 5 → 3).</p>
              </div>
              <div>
                <p className="mb-2"><strong>6.</strong> Replay. If you get victim data (addresses, items, totals), you've found an IDOR.</p>
              </div>
              <div>
                <p><strong>7.</strong> Try modifying data with a PUT/POST using the victim's ID.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Success Criteria</h3>
              <p className="text-brand-neutral-200">You can read or change another user's resource by ID without proper authorization.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Evidence to Capture</h3>
              <ul className="text-brand-neutral-200 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Attacker request/response showing data for victim's ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Short note on impact (privacy breach, account takeover primitives, financial impact)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-neutral-600 bg-brand-neutral-700/30 p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Understanding IDOR Vulnerabilities</h3>
          <p className="text-brand-neutral-300 text-sm leading-relaxed">
            Insecure Direct Object References (IDOR) occur when applications expose internal object references (like database IDs) 
            without proper access controls. Attackers can manipulate these references to access unauthorized data belonging to other users. 
            This vulnerability often appears in REST APIs where resource IDs are passed in URLs or request bodies without validation 
            that the requesting user has permission to access that specific resource.
          </p>
        </div>
      </main>
    </div>
  );
}
