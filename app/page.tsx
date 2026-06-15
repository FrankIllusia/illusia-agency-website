import Hero from './components/Hero';
import LogoParallax from './components/LogoParallax';
import Work from './components/Work';
import ParallaxVideo from './components/ParallaxVideo';
import Clients from './components/Clients';
import Services from './components/Services';
import AISection from './components/AISection';
import About from './components/About';
import Team from './components/Team';
import Contact from './components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <LogoParallax />
      <About />
      <Work />
      <ParallaxVideo />
      <Clients />
      <Services />
      <AISection />
      <Team />
      <Contact />
    </>
  );
}
