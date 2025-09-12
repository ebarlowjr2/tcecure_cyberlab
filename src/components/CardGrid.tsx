type Item = { title: string; blurb: string; href: string; tag?: string };

const items: Item[] = [
  { title: "Knowledge Base", blurb: "Articles, runbooks, and quickstarts.", href: "#" },
  { title: "Open-Source Cyber Tools", blurb: "Curated list: Wazuh, Zeek, Suricata, Velociraptor, more.", href: "#" },
  { title: "Learning Paths", blurb: "Blue team, red team, cloud security—guided tracks.", href: "#" },
  { title: "CTFs & Challenges", blurb: "Weekly labs and mini-CTFs to build skills.", href: "#" },
  { title: "Starter Projects", blurb: "Small, portfolio-ready projects with prompts.", href: "#" },
  { title: "Tool Sandboxes", blurb: "Hands-on practice environments (read-only demos).", href: "#" },
  { title: "Careers & Certs", blurb: "Study guides for Sec+, CySA+, CEH, AZ-500, more.", href: "#" }
];

export default function CardGrid() {
  return (
    <section id="cards" className="mt-14">
      <h2 className="text-xl font-semibold text-brand-neutral-50">Get started</h2>
      <p className="mt-2 text-brand-neutral-200">Pick a track or explore resources—links are placeholders for now.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <a
            key={it.title}
            href={it.href}
            className="group rounded-2xl border border-brand-neutral-600 bg-brand-card p-5 transition-all duration-200 hover:border-brand-accent/40 hover:bg-brand-neutral-700/40 hover:shadow-lg hover:shadow-brand-accent/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-neutral-50">{it.title}</h3>
              <span className="opacity-0 transition-all duration-200 group-hover:opacity-100 text-brand-accent group-hover:translate-x-1">→</span>
            </div>
            <p className="mt-2 text-sm text-brand-neutral-300">{it.blurb}</p>
          </a>
        ))}
      </div>

      <div id="how" className="mt-12 rounded-2xl border border-brand-neutral-600 bg-brand-neutral-700/30 p-6 shadow-lg">
        <h3 className="font-semibold text-brand-neutral-50">How it works</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-brand-neutral-200">
          <li>Request access or log in (Auth0 to be added later).</li>
          <li>Pick a learning path or open a sandbox.</li>
          <li>Track progress and save notes to your profile.</li>
        </ol>
      </div>
    </section>
  );
}
