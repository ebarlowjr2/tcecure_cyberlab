import { Routes, Route, Link } from "react-router-dom";
import HowItWorks from "./pages/HowItWorks";
import LearningPaths from "./pages/LearningPaths";
import StarterProjects from "./pages/StarterProjects";
import ScapScanningGuide from "./pages/ScapScanningGuide";
import Home from "./AppHome";
import tcecureLogo from "./assets/tcecure-logo.png";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,212,255,0.15),transparent_60%)]" />
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center">
          <img 
            src={tcecureLogo} 
            alt="TCecure Cyber Lab" 
            className="h-12 w-auto"
          />
        </Link>
        <nav className="flex gap-3">
          <Link className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" to="/how-it-works">How it works</Link>
          <Link className="rounded-xl bg-brand-accent/90 px-4 py-2 text-sm font-medium text-black hover:bg-brand-accent" to="#">Login</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/starter-projects" element={<StarterProjects />} />
        <Route path="/scap-scanning-guide" element={<ScapScanningGuide />} />
      </Routes>
    </div>
  );
}
