import Hero from "./components/Hero";
import CardGrid from "./components/CardGrid";
import Footer from "./components/Footer";

export default function AppHome() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(239,59,57,0.15),transparent_60%)]" />
      
      <main className="container mx-auto px-6">
        <Hero />
        <CardGrid />
      </main>

      <Footer />
    </div>
  );
}
