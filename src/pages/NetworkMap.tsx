import CyberLabMap from "../components/CyberLabMap";
import Footer from "../components/Footer";

export default function NetworkMap() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(34,211,238,0.15),transparent_60%)]" />

      <main className="container mx-auto px-6 py-10">
        <CyberLabMap />
      </main>

      <Footer />
    </div>
  );
}
