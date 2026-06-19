import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MessageCircle, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/components/layout/PublicLayout';
import PGCard from '@/components/shared/PGCard';
import FacilityIcon from '@/components/shared/FacilityIcon';
import { useData } from '@/context/DataContext';
import EditableText from '@/components/admin/EditableText';
import EditableButton from '@/components/admin/EditableButton';

export default function HomePage() {
  const { locations, facilities, settings, benefits } = useData();

  const defaultBenefits = [
    { id: '1', title: 'Affordable Pricing', description: 'Competitive rates with no hidden charges' },
    { id: '2', title: 'Prime Locations', description: 'Well-connected areas with easy access' },
    { id: '3', title: 'Modern Amenities', description: 'All facilities for comfortable living' },
    { id: '4', title: '24/7 Security', description: 'Safe and secure environment always' },
  ];

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <EditableText
              tag="h1"
              contentKey="hero_title"
              defaultContent={settings.heroTitle}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6 animate-slide-up"
            />
            <EditableText
              contentKey="hero_subtitle"
              defaultContent={settings.heroSubtitle}
              className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up block"
              multiline
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <EditableButton
                contentKey="hero_cta_primary"
                defaultText="Book a Visit"
                defaultHref="#locations"
                variant="hero"
                size="xl"
                icon={<ArrowRight className="h-5 w-5 mr-2" />}
              />
              <EditableButton
                contentKey="hero_cta_secondary"
                defaultText="Check Room Availability"
                defaultHref="#contact"
                variant="hero-outline"
                size="xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              All Amenities Included
            </h2>
            <p className="text-muted-foreground">
              Everything you need for comfortable living
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {facilities.map((facility, index) => (
              <div
                key={facility.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <FacilityIcon icon={facility.icon} name={facility.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our PG Locations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our well-maintained properties with all modern amenities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {locations.map((location, index) => (
              <div
                key={location.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PGCard location={location} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Choose Akruti PG Vastrapur?
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-base leading-relaxed mt-4">
              Finding the right paying guest accommodation in Ahmedabad can be stressful. At Akruti PG, we bridge the gap between luxury co-living and budget-friendly rentals. Located in the heart of Vastrapur and Gurukul, our properties offer seamless connectivity to major educational institutes, coaching hubs, and corporate offices. Whether you are looking for a single-occupancy AC room or an affordable triple-sharing budget PG, we provide a safe, hygienic, and vibrant community environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {displayBenefits.map((item, index) => (
              <div
                key={item.id || index}
                className="p-6 rounded-xl glass-card border border-border/50 shadow-card hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Nearby Landmarks Section */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Strategic Location in Vastrapur, Ahmedabad
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our PG branches are strategically positioned near Ahmedabad's top commercial, educational, and leisure hotspots.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl glass-card border border-border/50 shadow-card hover-lift cursor-default">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">
                01
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">Colleges & Institutes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enjoy an easy, hassle-free commute to premier educational landmarks including <strong>IIM Ahmedabad</strong>, <strong>Ahmedabad University</strong>, and <strong>NID</strong>.
              </p>
            </div>

            <div className="p-6 rounded-xl glass-card border border-border/50 shadow-card hover-lift cursor-default">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">
                02
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">Leisure & Shopping</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Live steps away from scenic <strong>Vastrapur Lake</strong>, premier shopping at <strong>AlphaOne (Ahmedabad One) Mall</strong>, and vibrant local street food markets.
              </p>
            </div>

            <div className="p-6 rounded-xl glass-card border border-border/50 shadow-card hover-lift cursor-default">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">
                03
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">Connectivity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stay exceptionally well-connected to major arterial routes like <strong>SG Highway</strong>, <strong>Nehru Nagar</strong>, and <strong>Satellite</strong> areas via local public transport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-card border-t border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Contact Us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions? We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {locations.map((location, index) => (
              <div
                key={location.id}
                className="p-8 rounded-2xl glass-card border border-border/50 shadow-card hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  {location.name}
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Phone</p>
                      <a
                        href={`tel:${location.phone}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {location.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">WhatsApp</p>
                      <a
                        href={`https://wa.me/${location.whatsapp?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-success transition-colors"
                      >
                        {location.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Address</p>
                      <p className="text-muted-foreground">{location.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={`tel:${location.phone}`}>
                    <Button>
                      <Phone className="h-4 w-4" />
                      Call Now
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${location.whatsapp?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="whatsapp">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <MapPin className="h-4 w-4" />
                      View on Map
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto rounded-2xl bg-primary p-8 md:p-12 text-center shadow-glow">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Find Your New Home?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Contact us today for room availability and pricing. We're here to help you find the perfect accommodation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${locations[0]?.phone}`} className="active-press">
                <Button variant="secondary" size="lg" className="w-full">
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
              </a>
              <a
                href={`https://wa.me/${locations[0]?.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="active-press"
              >
                <Button variant="whatsapp" size="lg" className="w-full">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
