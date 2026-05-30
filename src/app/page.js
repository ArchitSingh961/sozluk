import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import ProductSeries from '@/components/ProductSeries/ProductSeries';
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts';
import About from '@/components/About/About';
import Gallery from '@/components/Gallery/Gallery';
import Downloads from '@/components/Downloads/Downloads';
import CTA from '@/components/CTA/CTA';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductSeries />
        <FeaturedProducts />
        <About />
        <Gallery />
        <Downloads />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
