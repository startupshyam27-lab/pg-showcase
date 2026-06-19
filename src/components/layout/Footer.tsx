import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useData } from '@/context/DataContext';
import EditableText from '@/components/admin/EditableText';

export default function Footer() {
  const { settings, locations } = useData();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">PG Homes</span>
            </div>
            <EditableText
              contentKey="footer_description"
              defaultContent="Providing comfortable and affordable paying guest accommodations with all modern amenities."
              className="text-background/70 text-sm leading-relaxed"
            />
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-accent transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-accent transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-accent transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              {locations.map(loc => (
                <li key={loc.id}>
                  <Link
                    to={`/pg/${loc.slug}`}
                    className="text-background/70 hover:text-accent transition-colors text-sm"
                  >
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="h-4 w-4 text-accent" />
                {locations[0]?.phone}
              </li>
              <li className="flex items-start gap-2 text-background/70 text-sm">
                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                <span>{locations[0]?.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10 text-center text-background/50 text-sm">
          <EditableText
            contentKey="footer_copyright"
            defaultContent={settings.footerText}
          />
        </div>
      </div>
    </footer>
  );
}
