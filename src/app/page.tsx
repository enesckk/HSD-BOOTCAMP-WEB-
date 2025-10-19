import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
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
