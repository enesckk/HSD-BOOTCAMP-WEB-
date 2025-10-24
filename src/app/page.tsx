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
      <WaveDivider 
        className="-mt-8 md:-mt-6 relative z-40" 
        flow 
        colorCycle 
        flowSpeed={5} 
        cycleSpeed={6}
        topColor="#F7F7F8"
        accentColor="var(--accent)"
        bottomColor="#FFFFFF"
        height={{ mobile: 300, desktop: 480 }}
        variant="smooth"
      />
      <About />
      <PreviousMarathons />
      <ActiveBootcamp />
      <Timeline />
      <Requirements />
      <FAQ />
      <Contact />
      
      {/* Wave Decoration - İletişim ile Footer arası */}
      <div className="relative w-full">
        <svg
          className="w-full h-20 md:h-24 lg:h-28"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
            fill="url(#mainWaveGradient)"
          />
          <defs>
            <linearGradient id="mainWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <Footer />
      </main>
  );
}
