import { Phone, MessageCircle, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/components/layout/PublicLayout';
import { useData } from '@/context/DataContext';

export default function ContactPage() {
  const { locations } = useData();

  return (
    <PublicLayout>
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions? We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {locations.map(location => (
              <div
                key={location.id}
                className="p-8 rounded-2xl bg-card border border-border shadow-card"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  {location.name}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
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
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
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
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
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
    </PublicLayout>
  );
}
