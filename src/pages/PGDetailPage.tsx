import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, ChevronLeft, Building2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/components/layout/PublicLayout';
import FacilityIcon from '@/components/shared/FacilityIcon';
import FloorSection from '@/components/shared/FloorSection';
import GallerySection from '@/components/shared/GallerySection';
import { useData } from '@/context/DataContext';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';

export default function PGDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locations, facilities, updateLocation } = useData();

  const location = locations.find(loc => loc.slug === slug);

  if (!location) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">PG Not Found</h1>
          <p className="text-muted-foreground mb-8">The PG you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const handleUpdate = (field: keyof typeof location) => (value: any) => {
    updateLocation(location.id, { [field]: value });
  };

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border">
              {location.image ? (
                <EditableImage
                  src={location.image}
                  alt={location.name}
                  onSave={(url) => updateLocation(location.id, { image: url })}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center group">
                  {location.propertyType === 'bungalow' ? (
                    <Home className="h-24 w-24 text-primary/20" />
                  ) : (
                    <Building2 className="h-24 w-24 text-primary/20" />
                  )}
                  <div className="absolute inset-0">
                    <EditableImage
                      src=""
                      alt={location.name}
                      onSave={(url) => updateLocation(location.id, { image: url })}
                      className="w-full h-full opacity-0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">

              <EditableText
                tag="h1"
                value={location.name}
                onSave={handleUpdate('name')}
                className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4"
              />
              <EditableText
                value={location.description}
                onSave={handleUpdate('description')}
                multiline
                className="text-muted-foreground mb-6 leading-relaxed block"
              />

              <div className="flex items-start gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <EditableText
                  value={location.address}
                  onSave={handleUpdate('address')}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={`tel:${location.phone}`} className="active-press">
                  <Button variant="default" size="lg">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${location.whatsapp?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="active-press"
                >
                  <Button variant="whatsapp" size="lg">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="active-press"
                >
                  <Button variant="outline" size="lg">
                    <MapPin className="h-4 w-4" />
                    View on Map
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <GallerySection
        images={location.gallery || []}
        onUpdate={(newImages) => updateLocation(location.id, { gallery: newImages })}
      />

      {/* Facilities */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
            Facilities & Amenities
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {facilities.map(facility => (
              <FacilityIcon key={facility.id} icon={facility.icon} name={facility.name} size="sm" />
            ))}
          </div>
        </div>
      </section>

      {/* Rooms by Floor */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Rooms & Pricing
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {location.floors.map((floor, index) => (
              <FloorSection key={floor.id} floor={floor} defaultOpen={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Interested in {location.name}?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get in touch with us for more information about available rooms and pricing.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={`tel:${location.phone}`} className="active-press">
                <Button variant="default" size="lg">
                  <Phone className="h-4 w-4" />
                  {location.phone}
                </Button>
              </a>
              <a
                href={`https://wa.me/${location.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="active-press"
              >
                <Button variant="whatsapp" size="lg">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
