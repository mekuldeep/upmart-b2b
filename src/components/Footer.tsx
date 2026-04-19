import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useCategories } from '@/hooks/useStore';

const Footer = () => {
  const { categories } = useCategories();
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Upmart</h3>
            <p className="text-sm opacity-70 mb-4 font-body">
              Your trusted B2B footwear partner. Quality shoes from top brands at wholesale prices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70 font-body">
              {categories.slice(0, 5).map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="hover:text-primary transition-colors">
                  {cat.name} Footwear
                </Link>
              ))}
              <Link to="/about" className="hover:text-primary transition-colors mt-2">About Us</Link>
            </div>
          </div>

          {/* Our Brands */}
          <div>
            <h4 className="font-display font-semibold mb-4">Our Brands</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70 font-body">
              {['Rimco', 'Kodson', 'Supremelite', 'Paris', 'Decent', 'StonX', 'Aishwarya', 'Top-Gear', 'AXL'].map(b => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm opacity-70 font-body">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@upmart.co.in</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Delhi, India</div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-50 font-body">
          © 2026 Upmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
