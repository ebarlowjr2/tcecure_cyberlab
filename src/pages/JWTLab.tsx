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

export default function JWTLab() {
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
          <Badge>Lab 5</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            JWT/Cookie <span className="text-brand-accent">Manipulation</span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent font-medium">Advanced</span>
            <span className="text-sm text-brand-neutral-300">OWASP A01/A07: AuthN/AuthZ + A02: Crypto Failures</span>
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-brand-neutral-600 bg-brand-card p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Goal</h3>
              <p className="text-brand-neutral-200">Escalate privileges by tampering with the session token.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target</h3>
              <p className="text-brand-neutral-200">After login, tokens stored in cookie or web storage and sent on API calls (Authorization header)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Tools Required</h3>
              <p className="text-brand-neutral-200">DevTools, jwt_tool.py, jwt.io (if allowed), jq/Python</p>
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
                <p className="mb-2"><strong>1.</strong> Log in as a normal user.</p>
              </div>
              <div>
                <p className="mb-2"><strong>2.</strong> In the ZAP browser, open DevTools → Application (or Storage) and locate the JWT/session token (cookie or localStorage).</p>
              </div>
              <div>
                <p className="mb-2"><strong>3.</strong> Decode the JWT (locally):</p>
                <ul className="ml-4 mb-3 space-y-1">
                  <li>• <strong>Option A (no internet):</strong> use jwt_tool.py or jq/Python to base64-decode header/payload</li>
                  <li>• <strong>Option B:</strong> if allowed, paste into jwt.io to inspect claims</li>
                </ul>
              </div>
              <div>
                <p className="mb-2"><strong>4.</strong> Look for claims like role, email, or admin.</p>
              </div>
              <div>
                <p className="mb-2"><strong>5. Attack paths (try in order):</strong></p>
                
                <div className="ml-4 space-y-4">
                  <div>
                    <p className="font-medium text-brand-neutral-50 mb-2">Weak secret guess (HS256):</p>
                    <CodeBlock>python3 jwt_tool.py &lt;token&gt; -C -d jwt_secrets.txt</CodeBlock>
                    <p className="mb-2">If you find the key:</p>
                    <CodeBlock>python3 jwt_tool.py &lt;token&gt; -S hs256 -k &lt;found_key&gt; -pc admin -pv true</CodeBlock>
                    <p>Replace the token in the browser storage; refresh.</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-brand-neutral-50 mb-2">Algorithm confusion / none:</p>
                    <p>Change header {"{"} "alg": "none" {"}"} and strip signature (some frameworks block this—good!). Replace and refresh to test.</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-brand-neutral-50 mb-2">Client-side trust only:</p>
                    <p>Some endpoints render admin UI based solely on a client claim. Try setting role: "admin" in a resigned token and load /#/administration or call an admin API in Repeater.</p>
                  </div>
                </div>
              </div>
              <div>
                <p><strong>6.</strong> Watch ZAP for admin-only endpoints returning 200 now.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Success Criteria</h3>
              <p className="text-brand-neutral-200">You can access /#/administration or admin APIs without real admin credentials.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Evidence to Capture</h3>
              <ul className="text-brand-neutral-200 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Original token (redact signature if you like), decoded claims</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>The modified token claim and how you produced it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Admin page/API success screenshot</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-neutral-600 bg-brand-neutral-700/30 p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Understanding JWT Vulnerabilities</h3>
          <p className="text-brand-neutral-300 text-sm leading-relaxed">
            JSON Web Tokens (JWT) can be vulnerable to several attack vectors: <strong>weak secrets</strong> allow brute-force attacks 
            to discover signing keys, <strong>algorithm confusion</strong> exploits applications that accept unsigned tokens when 
            "alg" is set to "none", and <strong>client-side trust</strong> occurs when applications make authorization decisions 
            based solely on JWT claims without server-side validation. Proper JWT implementation requires strong secrets, 
            algorithm validation, and server-side permission checks.
          </p>
        </div>
      </main>
    </div>
  );
}
