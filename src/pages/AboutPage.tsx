import { Users, Award, Truck, Globe } from 'lucide-react';

const brands = ['Rimco', 'Kodson', 'Supremelite', 'Paris', 'Decent', 'StonX', 'Aishwarya', 'Top-Gear', 'AXL'];

const stats = [
  { icon: Users, value: '5000+', label: 'B2B Clients' },
  { icon: Award, value: '9', label: 'Premium Brands' },
  { icon: Truck, value: '28+', label: 'States Covered' },
  { icon: Globe, value: '10+', label: 'Years Experience' },
];

const AboutPage = () => (
  <div>
    {/* Hero */}
    <section className="bg-foreground text-background py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl font-extrabold mb-4">About Upmart</h1>
        <p className="font-body max-w-2xl mx-auto opacity-70">
          India's trusted B2B footwear marketplace connecting retailers with premium brands at wholesale prices. We make quality footwear accessible to businesses across India.
        </p>
      </div>
    </section>

    {/* Stats */}
    <section className="container mx-auto px-4 -mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl p-6 text-center shadow-card">
            <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground font-body">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Story */}
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-6">Our Story</h2>
        <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
          <p>Upmart was founded with a simple vision — to bridge the gap between quality footwear manufacturers and retailers across India. We understood the challenges small and medium retailers face in sourcing quality products at competitive prices.</p>
          <p>Today, we partner with 9 premium footwear brands to offer an extensive range of men's, women's, and kids' footwear along with accessories. Our platform simplifies the B2B buying process, offering bulk orders, competitive pricing, and pan-India delivery.</p>
          <p>From formal leather shoes to trendy sports sneakers, from elegant heels to durable school shoes — Upmart is your one-stop destination for wholesale footwear.</p>
        </div>
      </div>
    </section>

    {/* Brands */}
    <section className="bg-secondary/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Brands We Carry</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {brands.map(b => (
            <div key={b} className="bg-card rounded-xl p-6 text-center shadow-soft">
              <p className="font-display font-bold text-foreground text-lg">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-display text-2xl font-bold text-center mb-8">Why Choose Upmart?</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Wholesale Prices', desc: 'Get the best prices directly from brand partnerships. No middlemen, no markups.' },
          { title: 'Quality Assurance', desc: 'Every product undergoes quality checks. We guarantee genuine, premium footwear.' },
          { title: 'Pan India Delivery', desc: 'Reliable logistics network covering 28+ states with fast and safe delivery.' },
        ].map(item => (
          <div key={item.title} className="bg-card rounded-xl p-6 shadow-soft text-center">
            <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default AboutPage;
