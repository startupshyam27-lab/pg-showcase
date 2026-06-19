import PublicLayout from '@/components/layout/PublicLayout';
import { ShieldCheck, Heart, Sparkles, Smartphone } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-3 block">
              Your Home Away From Home
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Akruti PG & Co-Living
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Redefining student and professional housing in Ahmedabad with premium spaces, modern infrastructure, and a homely atmosphere.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Our Story & Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Established to redefine student and professional housing in Ahmedabad, Akruti PG combines modern infrastructure with a homely atmosphere. We eliminate the daily hassles of housekeeping, laundry, and meal preparation so you can focus entirely on your career and studies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe co-living is not just about sharing a roof, but about building a supportive, safe, and vibrant community where every resident can grow, connect, and excel in their endeavors.
              </p>
            </div>
            <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-glow border border-border">
              <img
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"
                alt="Akruti PG Common Area"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Why Stand Out?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-6 rounded-xl shadow-card">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Homely Atmosphere</h3>
              <p className="text-sm text-muted-foreground">Homely cooked nutritious food and a warm, welcoming community environment.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-card">
              <ShieldCheck className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Safe & Secure</h3>
              <p className="text-sm text-muted-foreground">24/7 security surveillance and gated locations ensure absolute peace of mind.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-card">
              <Smartphone className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Tech-Driven Living</h3>
              <p className="text-sm text-muted-foreground">Smart tenant management app for digital rent payments, support, and instant maintenance requests.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-card">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Zero Hassle</h3>
              <p className="text-sm text-muted-foreground">Professional daily housekeeping and laundry services included in your rental package.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
