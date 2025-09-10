import Image from "next/image";
import MainSection from "./components/MainSection";
import HowItWorksSection from "./components/HowItWorksSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="w-full px-4 py-6 max-w-7xl mx-auto">
      <MainSection />
      <section className="w-full mt-10">
        <HowItWorksSection />
      </section>
      <Footer />
    </div>
  );
}
