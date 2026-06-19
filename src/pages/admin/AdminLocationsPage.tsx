import { useState } from 'react';
import { Pencil, Trash2, Plus, Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useData } from '@/context/DataContext';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import GalleryManager from '@/components/admin/GalleryManager';

export default function AdminLocationsPage() {
  const { locations, updateLocation, addFloor, updateFloor, deleteFloor } = useData();
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [newFloorName, setNewFloorName] = useState('');

  const handleSaveLocation = (id: string, data: any) => {
    updateLocation(id, data);
    setEditingLocation(null);
    toast({ title: 'Location updated successfully' });
  };

  const handleAddFloor = (locationId: string) => {
    if (!newFloorName.trim()) {
      toast({ title: 'Please enter a floor name', variant: 'destructive' });
      return;
    }
    addFloor(locationId, {
      id: `floor-${Date.now()}`,
      name: newFloorName,
      rooms: [],
    });
    setNewFloorName('');
    toast({ title: 'Floor added successfully' });
  };

  const handleDeleteFloor = (locationId: string, floorId: string) => {
    if (confirm('Are you sure you want to delete this floor and all its rooms?')) {
      deleteFloor(locationId, floorId);
      toast({ title: 'Floor deleted successfully' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Locations</h1>
          <p className="text-muted-foreground mt-1">Manage your PG locations and floors</p>
        </div>

        <div className="space-y-6">
          {locations.map(location => (
            <div
              key={location.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
            >
              {/* Location Header */}
              <div className="p-6 bg-secondary/30 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {location.name}
                    </h2>
                    <p className="text-sm text-muted-foreground capitalize mt-1">
                      {location.propertyType}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Edit {location.name}</DialogTitle>
                      </DialogHeader>
                      <LocationEditForm location={location} onSave={handleSaveLocation} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Floors */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">Floors</h3>
                </div>

                <div className="space-y-3 mb-4">
                  {location.floors.map(floor => (
                    <div
                      key={floor.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">{floor.name}</p>
                        <p className="text-sm text-muted-foreground">{floor.rooms.length} rooms</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Floor</DialogTitle>
                            </DialogHeader>
                            <FloorEditForm
                              floor={floor}
                              onSave={(name) => {
                                updateFloor(location.id, floor.id, { name });
                                toast({ title: 'Floor updated' });
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFloor(location.id, floor.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Floor */}
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="New floor name"
                    value={newFloorName}
                    onChange={e => setNewFloorName(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button size="sm" onClick={() => handleAddFloor(location.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Floor
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function LocationEditForm({ location, onSave }: { location: any; onSave: (id: string, data: any) => void }) {
  const [formData, setFormData] = useState({
    name: location.name,
    description: location.description,
    address: location.address,
    phone: location.phone,
    whatsapp: location.whatsapp,
    mapUrl: location.mapUrl,
    image: location.image,
    gallery: location.gallery || [],
  });

  const width = "max-w-full"; // Hack to prevent overflow in dialog

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Main Image</Label>
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Photo Gallery</Label>
          <GalleryManager
            images={formData.gallery}
            onChange={(imgs) => setFormData(prev => ({ ...prev, gallery: imgs }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Google Map URL</Label>
          <Input
            value={formData.mapUrl}
            onChange={e => setFormData({ ...formData, mapUrl: e.target.value })}
          />
        </div>
      </div>

      <Button className="w-full" onClick={() => onSave(location.id, formData)}>
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
}

function FloorEditForm({ floor, onSave }: { floor: any; onSave: (name: string) => void }) {
  const [name, setName] = useState(floor.name);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Floor Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <Button className="w-full" onClick={() => onSave(name)}>
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>
    </div>
  );
}
