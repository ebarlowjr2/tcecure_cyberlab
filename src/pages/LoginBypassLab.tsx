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

export default function LoginBypassLab() {
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
          <Badge>Lab 1</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            Login Bypass <span className="text-brand-accent">(SQLi)</span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent font-medium">Beginner</span>
            <span className="text-sm text-brand-neutral-300">OWASP A03: Injection</span>
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-brand-neutral-600 bg-brand-card p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Goal</h3>
              <p className="text-brand-neutral-200">Authenticate without valid credentials using SQL injection.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target</h3>
              <p className="text-brand-neutral-200">/#/login (email/password form)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Tools Required</h3>
              <p className="text-brand-neutral-200">ZAP Browser, ZAP Repeater</p>
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
                <p className="mb-2"><strong>1.</strong> In the ZAP browser, navigate to the Login page.</p>
              </div>
              <div>
                <p className="mb-2"><strong>2.</strong> Try these payloads in the email/username field (password can be anything):</p>
                <CodeBlock>' OR 1=1--</CodeBlock>
              </div>
              <div>
                <p className="mb-2"><strong>3.</strong> If a valid email format is required, use:</p>
                <CodeBlock>test' OR 1=1--@x.com</CodeBlock>
              </div>
              <div>
                <p className="mb-2"><strong>4.</strong> If the form rejects that, try putting the payload in the password field instead and keep a normal email like a@x.com.</p>
              </div>
              <div>
                <p className="mb-2"><strong>5.</strong> In ZAP History, click the POST /rest/user/login (or similar) request.</p>
              </div>
              <div>
                <p className="mb-2"><strong>6.</strong> Send it to ZAP Repeater (right-click → Open/Resend with Request Editor).</p>
              </div>
              <div>
                <p><strong>7.</strong> Replay and tweak the payload until you see a 200 with a token or user object returned.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Success Criteria</h3>
              <p className="text-brand-neutral-200">You land on an authenticated page (e.g., shows your email or a user area) without knowing a real password.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Evidence to Capture</h3>
              <ul className="text-brand-neutral-200 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Screenshot of the login form with payload</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>ZAP request/response (200 OK) showing login success</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Screenshot of authenticated UI</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-neutral-600 bg-brand-neutral-700/30 p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Understanding SQL Injection</h3>
          <p className="text-brand-neutral-300 text-sm leading-relaxed">
            SQL injection occurs when user input is directly concatenated into SQL queries without proper sanitization. 
            The payload <code className="bg-brand-neutral-800 px-1 rounded">OR 1=1--</code> works by making the WHERE clause always true, 
            effectively bypassing the password check. The double dash (--) comments out the rest of the query, preventing syntax errors.
          </p>
        </div>
      </main>
    </div>
  );
}
