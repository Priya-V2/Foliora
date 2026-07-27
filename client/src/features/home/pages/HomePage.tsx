import Analytics from "../components/Analytics";
import CTA from "../components/CTA";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import LogosBar from "../components/LogosBar";
import Navbar from "../components/Navbar";
import Templates from "../components/Templates";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <Hero />
        <LogosBar />
        <Features />
        <HowItWorks />
        <Templates />
        <Analytics />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
