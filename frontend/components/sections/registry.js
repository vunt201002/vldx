import Navbar from './Navbar';
import Hero from './Hero';
import Collections from './Collections';
import About from './About';
import Featured from './Featured';
import Gallery from './Gallery';
import Contact from './Contact';
import ContentImage from './ContentImage';
import Footer from './Footer';
import MaterialShowcase from './MaterialShowcase';
import ColorPicker from './ColorPicker';
import ServiceProcess from './ServiceProcess';
import WhyChooseUs from './WhyChooseUs';

export const registry = {
  navbar: Navbar,
  hero: Hero,
  collections: Collections,
  about: About,
  featured: Featured,
  gallery: Gallery,
  contact: Contact,
  'content-image': ContentImage,
  footer: Footer,
  'material-showcase': MaterialShowcase,
  'color-picker': ColorPicker,
  'service-process': ServiceProcess,
  'why-choose-us': WhyChooseUs,
};
