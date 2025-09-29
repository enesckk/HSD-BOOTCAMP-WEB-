import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import Countdown from '@/components/home/Countdown';
import About from '@/components/home/About';
import Timeline from '@/components/home/Timeline';
import Requirements from '@/components/home/Requirements';
import Prizes from '@/components/home/Prizes';
import PreviousMarathons from '@/components/home/PreviousMarathons';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Countdown />
      <About />
      <Timeline />
      <Requirements />
      <Prizes />
      <PreviousMarathons />
      <FAQ />
      <Contact />
      <Footer />
      </main>
  );
}
