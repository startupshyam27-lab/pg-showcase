import { Bed as BedIcon } from 'lucide-react';
import { Room } from '@/types/pg';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const sharingType = room.beds.length === 1 ? 'Single' : `${room.beds.length} Sharing`;
  const minPrice = Math.min(...room.beds.map(b => b.price));
  const maxPrice = Math.max(...room.beds.map(b => b.price));

  return (
    <div className="rounded-xl glass-card border border-border/50 p-5 shadow-card hover-lift animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-display text-lg font-semibold text-foreground">Room {room.code}</h4>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                room.gender === 'boys' ? 'bg-boys text-boys-foreground' : 'bg-girls text-girls-foreground'
              }`}
            >
              {room.gender === 'boys' ? 'Boys' : 'Girls'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{sharingType}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs text-muted-foreground">Price Range</p>
          <p className="font-display font-semibold text-primary">
            ₹{minPrice.toLocaleString('en-IN')}
            {minPrice !== maxPrice && ` - ₹${maxPrice.toLocaleString('en-IN')}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {room.beds.map((bed, index) => (
          <div
            key={bed.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border/50"
          >
            <BedIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">₹{bed.price.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
