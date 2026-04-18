import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi%20Upmart!%20I'm%20interested%20in%20your%20footwear%20collection."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-success text-success-foreground p-4 rounded-full shadow-elevated hover:scale-110 transition-transform"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-6 h-6" />
  </a>
);

export default WhatsAppButton;
