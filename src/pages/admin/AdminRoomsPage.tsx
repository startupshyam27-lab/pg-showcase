import { useState } from 'react';
import { Pencil, Trash2, Plus, Save, Bed, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useData } from '@/context/DataContext';
import { toast } from '@/hooks/use-toast';
import { Room, Bed as BedType } from '@/types/pg';

export default function AdminRoomsPage() {
  const { locations, addRoom, updateRoom, deleteRoom, addBed, updateBed, deleteBed } = useData();

  const handleAddRoom = (locationId: string, floorId: string, code: string, gender: 'boys' | 'girls') => {
    addRoom(locationId, floorId, {
      id: `room-${Date.now()}`,
      code,
      gender,
      beds: [],
      isVisible: true,
    });
    toast({ title: 'Room added successfully' });
  };

  const handleAddBed = (locationId: string, floorId: string, roomId: string, price: number) => {
    const location = locations.find(l => l.id === locationId);
    const floor = location?.floors.find(f => f.id === floorId);
    const room = floor?.rooms.find(r => r.id === roomId);
    const bedCount = (room?.beds.length || 0) + 1;

    addBed(locationId, floorId, roomId, {
      id: `bed-${Date.now()}`,
      label: `Bed ${bedCount}`,
      price,
    });
    toast({ title: 'Bed added successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Rooms & Beds</h1>
          <p className="text-muted-foreground mt-1">Manage rooms and bed pricing</p>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {locations.map(location => (
            <AccordionItem
              key={location.id}
              value={location.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/30">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-semibold">{location.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({location.floors.reduce((acc, f) => acc + f.rooms.length, 0)} rooms)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {location.floors.map(floor => (
                  <div key={floor.id} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-foreground">{floor.name}</h3>
                      <AddRoomDialog
                        onAdd={(code, gender) => handleAddRoom(location.id, floor.id, code, gender)}
                      />
                    </div>

                    <div className="space-y-4">
                      {floor.rooms.map(room => (
                        <RoomItem
                          key={room.id}
                          room={room}
                          locationId={location.id}
                          floorId={floor.id}
                          onUpdateRoom={(data) => updateRoom(location.id, floor.id, room.id, data)}
                          onDeleteRoom={() => {
                            if (confirm('Delete this room and all beds?')) {
                              deleteRoom(location.id, floor.id, room.id);
                              toast({ title: 'Room deleted' });
                            }
                          }}
                          onAddBed={(price) => handleAddBed(location.id, floor.id, room.id, price)}
                          onUpdateBed={(bedId, data) => updateBed(location.id, floor.id, room.id, bedId, data)}
                          onDeleteBed={(bedId) => {
                            if (confirm('Delete this bed?')) {
                              deleteBed(location.id, floor.id, room.id, bedId);
                              toast({ title: 'Bed deleted' });
                            }
                          }}
                        />
                      ))}
                      {floor.rooms.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No rooms yet. Add your first room.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AdminLayout>
  );
}

function AddRoomDialog({ onAdd }: { onAdd: (code: string, gender: 'boys' | 'girls') => void }) {
  const [code, setCode] = useState('');
  const [gender, setGender] = useState<'boys' | 'girls'>('boys');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!code.trim()) {
      toast({ title: 'Enter room code', variant: 'destructive' });
      return;
    }
    onAdd(code, gender);
    setCode('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Room Code</Label>
            <Input placeholder="e.g., A, B, C..." value={code} onChange={e => setCode(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={(v: 'boys' | 'girls') => setGender(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boys">Boys</SelectItem>
                <SelectItem value="girls">Girls</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Add Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface RoomItemProps {
  room: Room;
  locationId: string;
  floorId: string;
  onUpdateRoom: (data: Partial<Room>) => void;
  onDeleteRoom: () => void;
  onAddBed: (price: number) => void;
  onUpdateBed: (bedId: string, data: Partial<BedType>) => void;
  onDeleteBed: (bedId: string) => void;
}

function RoomItem({
  room,
  onUpdateRoom,
  onDeleteRoom,
  onAddBed,
  onUpdateBed,
  onDeleteBed,
}: RoomItemProps) {
  const [newBedPrice, setNewBedPrice] = useState('4000');
  const [editingBed, setEditingBed] = useState<string | null>(null);
  const [editBedPrice, setEditBedPrice] = useState('');

  return (
    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-display font-semibold text-foreground">Room {room.code}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              room.gender === 'boys' ? 'bg-boys text-boys-foreground' : 'bg-girls text-girls-foreground'
            }`}
          >
            {room.gender === 'boys' ? 'Boys' : 'Girls'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdateRoom({ isVisible: !room.isVisible })}
            title={room.isVisible ? 'Hide room' : 'Show room'}
          >
            {room.isVisible ? (
              <Eye className="h-4 w-4 text-success" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onDeleteRoom}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Beds */}
      <div className="flex flex-wrap gap-2 mb-4">
        {room.beds.map(bed => (
          <div
            key={bed.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border"
          >
            <Bed className="h-4 w-4 text-primary" />
            {editingBed === bed.id ? (
              <Input
                type="number"
                value={editBedPrice}
                onChange={e => setEditBedPrice(e.target.value)}
                className="w-20 h-7 text-sm"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    onUpdateBed(bed.id, { price: Number(editBedPrice) });
                    setEditingBed(null);
                    toast({ title: 'Bed price updated' });
                  }
                }}
              />
            ) : (
              <span className="text-sm font-medium">₹{bed.price.toLocaleString('en-IN')}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                if (editingBed === bed.id) {
                  onUpdateBed(bed.id, { price: Number(editBedPrice) });
                  setEditingBed(null);
                  toast({ title: 'Bed price updated' });
                } else {
                  setEditingBed(bed.id);
                  setEditBedPrice(bed.price.toString());
                }
              }}
            >
              {editingBed === bed.id ? (
                <Save className="h-3 w-3" />
              ) : (
                <Pencil className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onDeleteBed(bed.id)}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Bed */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Price"
          value={newBedPrice}
          onChange={e => setNewBedPrice(e.target.value)}
          className="w-28"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            onAddBed(Number(newBedPrice) || 4000);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Bed
        </Button>
      </div>
    </div>
  );
}
