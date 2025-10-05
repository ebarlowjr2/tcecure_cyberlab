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

export default function PriceTamperingLab() {
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
          <Badge>Lab 4</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            Price / Quantity <span className="text-brand-accent">Tampering</span>
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
              <p className="text-brand-neutral-200">Manipulate totals or apply unauthorized discounts.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target</h3>
              <p className="text-brand-neutral-200">Basket update endpoints and coupon application</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Tools Required</h3>
              <p className="text-brand-neutral-200">ZAP, ZAP Repeater, ZAP Fuzzer, SecLists (optional)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-2">Target Server</h3>
              <p className="text-brand-neutral-200">Juicebox-001 (On-premises)</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-brand-neutral-50 mb-4">Step-by-Step Instructions</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-brand-neutral-50 mb-3">Track A: Quantity/price manipulation</h4>
              <div className="space-y-4 text-brand-neutral-200">
                <div>
                  <p className="mb-2"><strong>1.</strong> Add 1–2 items to cart. Proceed to basket.</p>
                </div>
                <div>
                  <p className="mb-2"><strong>2.</strong> In ZAP, intercept the request that updates quantities (look for PUT/POST like /rest/basket/ or /api/BasketItems).</p>
                </div>
                <div>
                  <p className="mb-2"><strong>3.</strong> Send to Repeater and try edits in JSON body:</p>
                  <ul className="ml-4 mb-3 space-y-1">
                    <li>• Increase quantity (e.g., 1 → 999)</li>
                    <li>• Try negative quantities</li>
                    <li>• If the client sends price/total, try lowering them (many apps should ignore or recompute server-side)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>4.</strong> Re-send and refresh the basket page. Did totals change?</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-brand-neutral-50 mb-3">Track B: Coupon abuse / brute-forcing</h4>
              <div className="space-y-4 text-brand-neutral-200">
                <div>
                  <p className="mb-2"><strong>1.</strong> Find the Apply Coupon endpoint in ZAP (search for "coupon" in the History/filter).</p>
                </div>
                <div>
                  <p className="mb-2"><strong>2.</strong> Send to Fuzzer (right-click request → Fuzz…) and replace the coupon value with a small wordlist:</p>
                  <CodeBlock>FREE, DISCOUNT, WELCOME10, SUMMER, BLACKFRIDAY</CodeBlock>
                </div>
                <div>
                  <p className="mb-2"><strong>3.</strong> If you have SecLists, try a short coupon list.</p>
                </div>
                <div>
                  <p><strong>4.</strong> Look for HTTP 200 with a changed discount/total.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Success Criteria</h3>
              <p className="text-brand-neutral-200">Checkout/basket reflects a manipulated total or accepts an unauthorized coupon.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Evidence to Capture</h3>
              <ul className="text-brand-neutral-200 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>The specific request and altered field</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>Before/after basket totals (screenshots)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>A one-liner on business impact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-neutral-600 bg-brand-neutral-700/30 p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-50 mb-3">Understanding Business Logic Flaws</h3>
          <p className="text-brand-neutral-300 text-sm leading-relaxed">
            Business logic vulnerabilities occur when applications fail to properly validate business rules and constraints. 
            Price tampering exploits weak client-side validation or insufficient server-side checks. Applications should never 
            trust pricing data from the client and must recalculate totals server-side. Coupon abuse happens when discount 
            codes lack proper validation, expiration checks, or usage limits, allowing attackers to apply unauthorized discounts.
          </p>
        </div>
      </main>
    </div>
  );
}
