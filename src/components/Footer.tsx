import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useCategories, useSettings } from '@/hooks/useStore';

const Footer = () => {
  const { categories } = useCategories();
  const { settings } = useSettings();

  // Social URLs with fallbacks
  const fbUrl = settings?.facebook || "#";
  const igUrl = settings?.instagram || "#";
  const twitterUrl = settings?.twitter || "#";
  const ytUrl = settings?.youtube || "#";

  // Contact Info with fallbacks
  const officeAddress = settings?.address || "123 Business Park, Sector 62";
  const city = settings?.city || "Noida";
  const state = settings?.state || "Uttar Pradesh";
  const zip = settings?.zip || "201301";
  const phone = settings?.phone || "+91 98765 43210";
  const email = settings?.email || "info@upmart.co.in";
  
  // Brands list from comma separated string or fallback
  const brandsList = settings?.brands 
    ? settings.brands.split(',').map(b => b.trim()).filter(Boolean)
    : ['Rimco', 'Kodson', 'Supremelite', 'Paris', 'Decent', 'StonX', 'Aishwarya', 'Top-Gear', 'AXL'];

  const siteName = settings?.siteName || "Upmart";

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">{siteName}</h3>
            <p className="text-sm opacity-70 mb-4 font-body">
              Your trusted B2B footwear partner. Quality shoes from top brands at wholesale prices.
            </p>
            <div className="flex gap-3">
              <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors"><Youtube className="w-4 h-4" /></a>
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
              {brandsList.slice(0, 9).map(b => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm opacity-70 font-body">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {email}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {phone}</div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {officeAddress}<br />
                  {city}, {state} - {zip}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-50 font-body">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
