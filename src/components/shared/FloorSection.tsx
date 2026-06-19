import { ChevronDown } from 'lucide-react';
import { Floor } from '@/types/pg';
import RoomCard from './RoomCard';
import { useState } from 'react';

interface FloorSectionProps {
  floor: Floor;
  defaultOpen?: boolean;
}

export default function FloorSection({ floor, defaultOpen = true }: FloorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const visibleRooms = floor.rooms.filter(r => r.isVisible);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card animate-slide-up">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">
              {floor.name.charAt(0)}
            </span>
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">{floor.name}</h3>
            <p className="text-sm text-muted-foreground">{visibleRooms.length} rooms</p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 grid gap-4 sm:grid-cols-2">
          {visibleRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
          {visibleRooms.length === 0 && (
            <p className="col-span-2 text-center text-muted-foreground py-8">
              No rooms available on this floor.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
