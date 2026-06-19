import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableButton from '@/components/admin/EditableButton';
import { useData } from '@/context/DataContext';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export default function Header() {
  const { locations } = useData();
  const mainPhone = locations[0]?.phone || '+91 98765 43210';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 active-press">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">PG Homes</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {locations.map(loc => (
            <Link
              key={loc.id}
              to={`/pg/${loc.slug}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors active-press"
            >
              {loc.name}
            </Link>
          ))}

          <a
            href="/#contact"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors active-press"
          >
            Contact
          </a>
        </nav>

        {/* Action Buttons & Hamburger Menu */}
        <div className="flex items-center gap-2 md:gap-3">
          <EditableButton
            contentKey="header_call_btn"
            defaultText="Call Now"
            defaultHref={`tel:${mainPhone}`}
            variant="outline"
            size="sm"
            icon={<Phone className="h-4 w-4" />}
            hideTextOnMobile={true}
          />
          <EditableButton
            contentKey="header_whatsapp_btn"
            defaultText="WhatsApp"
            defaultHref={`https://wa.me/${mainPhone.replace(/[^0-9]/g, '')}`}
            variant="whatsapp"
            size="sm"
            icon={<MessageCircle className="h-4 w-4" />}
            hideTextOnMobile={true}
          />

          {/* Hamburger Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden active-press">
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card border-l border-border p-6 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display text-xl font-semibold text-foreground">PG Homes</span>
                </div>

                <div className="flex flex-col space-y-4">
                  {locations.map(loc => (
                    <SheetClose asChild key={loc.id}>
                      <Link
                        to={`/pg/${loc.slug}`}
                        className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors py-2 border-b border-border/30"
                      >
                        {loc.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <a
                      href="/#contact"
                      className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors py-2 border-b border-border/30"
                    >
                      Contact Us
                    </a>
                  </SheetClose>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                <a href={`tel:${mainPhone}`} className="block w-full">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-4 active-press">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${mainPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="whatsapp" className="w-full flex items-center justify-center gap-2 py-4 active-press">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
