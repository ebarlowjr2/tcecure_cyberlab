import React from "react";
import { Link } from "react-router-dom";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
    {children}
  </span>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-brand-neutral-800 border border-brand-neutral-600 rounded-lg p-3 font-mono text-sm text-brand-neutral-100 my-2">
    {children}
  </div>
);

export default function XSSLab() {
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
          <Badge>Lab 2</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            Stored & Reflected <span className="text-brand-accent">XSS</span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent font-medium">Beginner</span>
            <span className="text-sm text-brand-neutral-300">OWASP A03: Injection (XSS)</span>
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-brand-neutral-600 bg-brand-card p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Goal</h3>
              <p className="text-brand-neutral-200">Execute JavaScript in the victim's browser.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target</h3>
              <p className="text-brand-neutral-200">Search (reflected), Customer Feedback or product Reviews (stored)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Tools Required</h3>
              <p className="text-brand-neutral-200">Browser, ZAP, DevTools</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target Server</h3>
              <p className="text-brand-neutral-200">Juicebox-001 (On-premises)</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-brand-neutral-50 mb-4">Step-by-Step Instructions</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-brand-neutral-50 mb-3">A) Reflected XSS (quick win)</h4>
              <div className="space-y-4 text-brand-neutral-200">
                <div>
                  <p className="mb-2"><strong>1.</strong> In the site Search box, input:</p>
                  <CodeBlock>&lt;img src=x onerror=alert(1)&gt;</CodeBlock>
                </div>
                <div>
                  <p className="mb-2"><strong>2.</strong> Watch the page for an alert. If none, try:</p>
                  <CodeBlock>&lt;script&gt;alert(1)&lt;/script&gt;</CodeBlock>
                </div>
                <div>
                  <p className="mb-2"><strong>3.</strong> Check ZAP History for the corresponding GET (e.g., /rest/products/search?q=...).</p>
                </div>
                <div>
                  <p><strong>4.</strong> Open in Repeater and try URL-encoding your payload.</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-brand-neutral-50 mb-3">B) Stored XSS (needs a "victim" visit)</h4>
              <div className="space-y-4 text-brand-neutral-200">
                <div>
                  <p className="mb-2"><strong>1.</strong> As attacker (odd PC), go to a Product → Reviews or Customer Feedback page.</p>
                </div>
                <div>
                  <p className="mb-2"><strong>2.</strong> Submit a review/feedback comment containing:</p>
                  <CodeBlock>&lt;img src=x onerror=alert('pwned by ' + document.domain)&gt;</CodeBlock>
                </div>
                <div>
                  <p className="mb-2"><strong>3.</strong> As victim (paired even PC), browse to the same product/reviews or Customer Feedback page.</p>
                </div>
                <div>
                  <p><strong>4.</strong> Optional: Try image/SVG upload areas. Upload an .svg containing a script. If the app blocks .svg, try content-type mismatches or file extension confusion—but keep it in scope and capture request/response.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Success Criteria</h3>
              <p className="text-brand-neutral-200">You see an alert box immediately after search (reflected) or when victim visits the page (stored).</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Evidence to Capture</h3>
              <ul className="text-brand-neutral-200 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>The submitted payload (screenshot)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Victim's alert box</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>ZAP request showing stored content accepted</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-neutral-600 bg-brand-neutral-700/30 p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Understanding XSS Attacks</h3>
          <p className="text-brand-neutral-300 text-sm leading-relaxed">
            Cross-Site Scripting (XSS) occurs when user input is rendered in the browser without proper sanitization. 
            <strong> Reflected XSS</strong> executes immediately when the payload is processed, while <strong>Stored XSS</strong> 
            persists in the application database and executes when other users view the content. Both can lead to session hijacking, 
            data theft, and malicious actions performed on behalf of victims.
          </p>
        </div>
      </main>
    </div>
  );
}
