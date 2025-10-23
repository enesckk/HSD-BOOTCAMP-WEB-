import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import WaveDivider from '@/components/ui/WaveDivider';
import ActiveBootcamp from '@/components/home/ActiveBootcamp';
import Timeline from '@/components/home/Timeline';
import Requirements from '@/components/home/Requirements';
import PreviousMarathons from '@/components/home/PreviousMarathons';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WaveDivider className="-mt-16 md:-mt-10" flow colorCycle flowSpeed={10} cycleSpeed={12} />
      <About />
      <PreviousMarathons />
      <ActiveBootcamp />
      <Timeline />
      <Requirements />
      <FAQ />
      <Contact />
      <Footer />
      </main>
  );
}
