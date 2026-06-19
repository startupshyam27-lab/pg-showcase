import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableButton from '@/components/admin/EditableButton';
import { useData } from '@/context/DataContext';

export default function Header() {
  const { locations } = useData();
  const mainPhone = locations[0]?.phone || '+91 98765 43210';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">PG Homes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {locations.map(loc => (
            <Link
              key={loc.id}
              to={`/pg/${loc.slug}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {loc.name}
            </Link>
          ))}

          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <EditableButton
            contentKey="header_call_btn"
            defaultText="Call Now"
            defaultHref={`tel:${mainPhone}`}
            variant="outline"
            size="sm"
            icon={<Phone className="h-4 w-4 mr-2" />}
            className="hidden sm:inline-flex"
          />
          <EditableButton
            contentKey="header_whatsapp_btn"
            defaultText="WhatsApp"
            defaultHref={`https://wa.me/${mainPhone.replace(/[^0-9]/g, '')}`}
            variant="whatsapp"
            size="sm"
            icon={<MessageCircle className="h-4 w-4 mr-2" />}
          />
        </div>
      </div>
    </header>
  );
}
