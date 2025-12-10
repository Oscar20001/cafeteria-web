import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuGallery from '@/components/MenuGallery';
import Gallery from '@/components/Gallery';
import PayPalPayment from '@/components/PayPalButton';
import LocationMap from '@/components/LocationMap';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />
      <Hero />
      <MenuGallery />
      <Gallery />
      <LocationMap />
      
      {/* Wrapper to ensure seamless transition to footer */}
      <div className="bg-black relative">
        <div className="bg-white relative z-10">
          <PayPalPayment />
        </div>
        
        <Footer />
      </div>
    </main>
  );
}
