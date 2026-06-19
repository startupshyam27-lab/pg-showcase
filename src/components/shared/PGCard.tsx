import { Link } from 'react-router-dom';
import { Building2, Home, ChevronRight } from 'lucide-react';
import { PGLocation } from '@/types/pg';

interface PGCardProps {
  location: PGLocation;
}

export default function PGCard({ location }: PGCardProps) {
  const totalRooms = location.floors.reduce((acc, floor) => acc + floor.rooms.length, 0);
  const totalBeds = location.floors.reduce(
    (acc, floor) => acc + floor.rooms.reduce((rAcc, room) => rAcc + room.beds.length, 0),
    0
  );
  const minPrice = Math.min(
    ...location.floors.flatMap(f => f.rooms.flatMap(r => r.beds.map(b => b.price)))
  );

  return (
    <Link
      to={`/pg/${location.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
        {location.image ? (
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {location.propertyType === 'bungalow' ? (
              <Home className="h-16 w-16 text-primary/30" />
            ) : (
              <Building2 className="h-16 w-16 text-primary/30" />
            )}
          </div>
        )}

      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {location.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {location.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{location.floors.length} Floors</span>
            <span>•</span>
            <span>{totalRooms} Rooms</span>
            <span>•</span>
            <span>{totalBeds} Beds</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-lg font-display font-semibold text-primary">
              ₹{minPrice.toLocaleString('en-IN')}<span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-accent font-medium text-sm group-hover:gap-2 transition-all">
            View Rooms
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
