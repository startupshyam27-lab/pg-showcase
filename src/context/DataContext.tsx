import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PGLocation, Facility, SiteSettings, Floor, Room, Bed, Benefit, Amenity } from '@/types/pg';
import { initialLocations, initialFacilities, initialSettings } from '@/data/initialData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DataContextType {
  locations: PGLocation[];
  facilities: Facility[];
  settings: SiteSettings;
  benefits: Benefit[];
  addBenefit: (benefit: Omit<Benefit, 'id'>) => Promise<void>;
  updateBenefit: (id: string, benefit: Partial<Benefit>) => Promise<void>;
  deleteBenefit: (id: string) => Promise<void>;
  addAmenity: (amenity: Omit<Amenity, 'id'>) => Promise<void>;
  deleteAmenity: (id: string) => Promise<void>;
  updateLocation: (id: string, data: Partial<PGLocation>) => Promise<void>;
  addFloor: (locationId: string, floor: Floor) => Promise<void>;
  updateFloor: (locationId: string, floorId: string, data: Partial<Floor>) => Promise<void>;
  deleteFloor: (locationId: string, floorId: string) => Promise<void>;
  addRoom: (locationId: string, floorId: string, room: Room) => Promise<void>;
  updateRoom: (locationId: string, floorId: string, roomId: string, data: Partial<Room>) => Promise<void>;
  deleteRoom: (locationId: string, floorId: string, roomId: string) => Promise<void>;
  addBed: (locationId: string, floorId: string, roomId: string, bed: Bed) => Promise<void>;
  updateBed: (locationId: string, floorId: string, roomId: string, bedId: string, data: Partial<Bed>) => Promise<void>;
  deleteBed: (locationId: string, floorId: string, roomId: string, bedId: string) => Promise<void>;

  updateSettings: (data: Partial<SiteSettings>) => Promise<void>;
  getTotalRooms: () => number;
  getTotalBeds: () => number;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<PGLocation[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Locations with all nested data
      const { data: locationsData, error } = await supabase
        .from('locations')
        .select(`
          *,
          floors (
            *,
            rooms (
              *,
              beds (*)
            )
          )
        `)
        .order('created_at', { ascending: true });

      // Fetch Benefits
      const { data: benefitsData } = await supabase
        .from('benefits')
        .select('*')
        .order('created_at', { ascending: true });

      if (benefitsData) {
        setBenefits(benefitsData);
      }

      if (error) throw error;

      if (locationsData) {
        // Transform data to match frontend types if necessary, mostly likely just needs sorting
        const sortedLocations = locationsData.map((loc: any) => ({
          ...loc,
          propertyType: loc.property_type,
          mapUrl: loc.map_url,
          floors: loc.floors
            .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((floor: any) => ({
              ...floor,
              rooms: floor.rooms
                .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((room: any) => ({
                  ...room,
                  isVisible: room.is_visible, // Map snake_case to camelCase
                  beds: room.beds.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                }))
            }))
        }));

        // If DB is empty, use initial data and seed it (optional, but good for first run)
        if (sortedLocations.length === 0) {
          setLocations([]);
        } else {
          setLocations(sortedLocations);
        }
      }

      // Fetch Settings (Site Content)
      const { data: settingsData } = await supabase
        .from('site_content')
        .select('*')
        .eq('group', 'settings');

      if (settingsData && settingsData.length > 0) {
        const newSettings = { ...initialSettings };
        settingsData.forEach(item => {
          if (item.key === 'hero_title') newSettings.heroTitle = item.value;
          if (item.key === 'hero_subtitle') {
            newSettings.heroSubtitle = item.value && item.value.includes("Fully furnished co-living spaces") ? "" : item.value;
          }
          if (item.key === 'footer_text') newSettings.footerText = item.value;
        });
        setSettings(newSettings);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateLocation = async (id: string, data: Partial<PGLocation>) => {
    // Prepare payload for Supabase (snake_case)
    const payload: any = { ...data };

    if (payload.propertyType !== undefined) {
      payload.property_type = payload.propertyType;
      delete payload.propertyType;
    }
    if (payload.mapUrl !== undefined) {
      payload.map_url = payload.mapUrl;
      delete payload.mapUrl;
    }

    // Remove fields that are not columns in locations table
    delete payload.floors;
    delete payload.id; // Usually not updated

    try {
      // Log payload for debugging
      console.log('Updating location with payload:', payload);

      const { error } = await supabase
        .from('locations')
        .update({
          ...payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, ...data } : loc));
      toast.success('Location updated');
    } catch (error: any) {
      console.error('Error updating location:', error);

      // Auto-fix for missing gallery column (Schema mismatch)
      if (error.message?.includes("Could not find the 'gallery' column")) {
        try {
          console.warn('Gallery column missing. Retrying update without gallery...');
          const retryPayload = { ...payload };
          delete retryPayload.gallery;

          const { error: retryError } = await supabase
            .from('locations')
            .update({
              ...retryPayload,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (retryError) throw retryError;

          // Optimistic update (excluding gallery change if it was part of data)
          // We still update local state, but warn user
          setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, ...data } : loc));
          toast.warning('Details saved! Note: Photo Gallery requires a database update.');
          return;
        } catch (retryErr: any) {
          console.error('Retry failed:', retryErr);
          toast.error(`Failed to update location: ${retryErr.message}`);
          return;
        }
      }

      toast.error(`Failed to update location: ${error.message || 'Unknown error'}`);
    }
  };

  const addFloor = async (locationId: string, floor: Floor) => {
    try {
      // If floor.id is a temp ID (not a UUID), let DB generate one or generate one here.
      // Since 'floor-${Date.now()}' is obviously not UUID, we should be careful.
      // Ideally, the caller should provide a valid UUID or we let DB decide.
      // For insert, we can omit ID if it's not a valid UUID.
      const payload: any = {
        location_id: locationId,
        name: floor.name,
      };

      // Only include ID if it looks like a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(floor.id)) {
        payload.id = floor.id;
      }

      const { data, error } = await supabase
        .from('floors')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return { ...loc, floors: [...loc.floors, { ...floor, ...data }] };
        }
        return loc;
      }));
      toast.success('Floor added');
    } catch (error) {
      console.error('Error adding floor:', error);
      toast.error('Failed to add floor');
    }
  };

  const updateFloor = async (locationId: string, floorId: string, data: Partial<Floor>) => {
    try {
      const { error } = await supabase
        .from('floors')
        .update(data)
        .eq('id', floorId);

      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return {
            ...loc,
            floors: loc.floors.map(f => f.id === floorId ? { ...f, ...data } : f),
          };
        }
        return loc;
      }));
      toast.success('Floor updated');
    } catch (error) {
      console.error("Error updating floor", error);
      toast.error("Failed to update floor");
    }
  };

  const deleteFloor = async (locationId: string, floorId: string) => {
    try {
      const { error } = await supabase.from('floors').delete().eq('id', floorId);
      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return { ...loc, floors: loc.floors.filter(f => f.id !== floorId) };
        }
        return loc;
      }));
      toast.success('Floor deleted');
    } catch (error) {
      console.error('Error deleting floor', error);
      toast.error('Failed to delete floor');
    }
  };

  const addRoom = async (locationId: string, floorId: string, room: Room) => {
    try {
      const payload: any = {
        floor_id: floorId,
        code: room.code,
        gender: room.gender,
        is_visible: room.isVisible,
      };

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(room.id)) {
        payload.id = room.id;
      }

      const { data, error } = await supabase.from('rooms').insert(payload).select().single();

      if (error) throw error;

      const newRoom = { ...room, ...data, isVisible: data.is_visible }; // Ensure mapping

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return {
            ...loc,
            floors: loc.floors.map(f => {
              if (f.id === floorId) {
                return { ...f, rooms: [...f.rooms, newRoom] };
              }
              return f;
            }),
          };
        }
        return loc;
      }));
      toast.success('Room added');
    } catch (error) {
      console.error('Error adding room', error);
      toast.error('Failed to add room');
    }
  };

  const updateRoom = async (locationId: string, floorId: string, roomId: string, data: Partial<Room>) => {
    try {
      const updatePayload: any = { ...data };
      if (data.isVisible !== undefined) {
        updatePayload.is_visible = data.isVisible;
        delete updatePayload.isVisible;
      }

      delete updatePayload.beds;
      delete updatePayload.id;

      const { error } = await supabase.from('rooms').update(updatePayload).eq('id', roomId);
      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return {
            ...loc,
            floors: loc.floors.map(f => {
              if (f.id === floorId) {
                return {
                  ...f,
                  rooms: f.rooms.map(r => r.id === roomId ? { ...r, ...data } : r),
                };
              }
              return f;
            }),
          };
        }
        return loc;
      }));
      toast.success('Room updated');
    } catch (error) {
      console.error('Error updating room', error);
      toast.error('Failed to update room');
    }
  };

  const deleteRoom = async (locationId: string, floorId: string, roomId: string) => {
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', roomId);
      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return {
            ...loc,
            floors: loc.floors.map(f => {
              if (f.id === floorId) {
                return { ...f, rooms: f.rooms.filter(r => r.id !== roomId) };
              }
              return f;
            }),
          };
        }
        return loc;
      }));
      toast.success('Room deleted');
    } catch (error) {
      console.error('Error deleting room', error);
      toast.error('Failed to delete room');
    }
  };

  const addBed = async (locationId: string, floorId: string, roomId: string, bed: Bed) => {
    try {
      const payload: any = {
        room_id: roomId,
        label: bed.label,
        price: bed.price,
      };

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(bed.id)) {
        payload.id = bed.id;
      }

      const { data, error } = await supabase.from('beds').insert(payload).select().single();

      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return {
            ...loc,
            floors: loc.floors.map(f => {
              if (f.id === floorId) {
                return {
                  ...f,
                  rooms: f.rooms.map(r => {
                    if (r.id === roomId) {
                      return { ...r, beds: [...r.beds, { ...bed, ...data }] };
                    }
                    return r;
                  }),
                };
              }
              return f;
            }),
          };
        }
        return loc;
      }));
      toast.success('Bed added');
    } catch (error) {
      console.error('Error adding bed', error);
      toast.error('Failed to add bed');
    }
  };

  const updateBed = async (locationId: string, floorId: string, roomId: string, bedId: string, data: Partial<Bed>) => {
    try {
      const { error } = await supabase.from('beds').update(data).eq('id', bedId);
      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return {
            ...loc,
            floors: loc.floors.map(f => {
              if (f.id === floorId) {
                return {
                  ...f,
                  rooms: f.rooms.map(r => {
                    if (r.id === roomId) {
                      return {
                        ...r,
                        beds: r.beds.map(b => b.id === bedId ? { ...b, ...data } : b),
                      };
                    }
                    return r;
                  }),
                };
              }
              return f;
            }),
          };
        }
        return loc;
      }));
      toast.success('Bed updated');
    } catch (error) {
      console.error('Error updating bed', error);
      toast.error('Failed to update bed');
    }
  };

  const deleteBed = async (locationId: string, floorId: string, roomId: string, bedId: string) => {
    try {
      const { error } = await supabase.from('beds').delete().eq('id', bedId);
      if (error) throw error;

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          return {
            ...loc,
            floors: loc.floors.map(f => {
              if (f.id === floorId) {
                return {
                  ...f,
                  rooms: f.rooms.map(r => {
                    if (r.id === roomId) {
                      return { ...r, beds: r.beds.filter(b => b.id !== bedId) };
                    }
                    return r;
                  }),
                };
              }
              return f;
            }),
          };
        }
        return loc;
      }));
      toast.success('Bed deleted');
    } catch (error) {
      console.error('Error deleting bed', error);
      toast.error('Failed to delete bed');
    }
  };

  const addBenefit = async (benefit: Omit<Benefit, 'id'>) => {
    try {
      const { data, error } = await supabase.from('benefits').insert(benefit).select().single();
      if (error) throw error;
      setBenefits(prev => [...prev, data]);
      toast.success('Benefit added');
    } catch (error) {
      console.error('Error adding benefit', error);
      toast.error('Failed to add benefit');
    }
  };

  const updateBenefit = async (id: string, benefit: Partial<Benefit>) => {
    try {
      const { data, error } = await supabase.from('benefits').update(benefit).eq('id', id).select().single();
      if (error) throw error;
      setBenefits(prev => prev.map(b => b.id === id ? data : b));
      toast.success('Benefit updated');
    } catch (error) {
      console.error('Error updating benefit', error);
      toast.error('Failed to update benefit');
    }
  };

  const deleteBenefit = async (id: string) => {
    try {
      const { error } = await supabase.from('benefits').delete().eq('id', id);
      if (error) throw error;
      setBenefits(prev => prev.filter(b => b.id !== id));
      toast.success('Benefit deleted');
    } catch (error) {
      console.error('Error deleting benefit', error);
      toast.error('Failed to delete benefit');
    }
  };

  const addAmenity = async (amenity: Omit<Amenity, 'id'>) => {
    try {
      const { data, error } = await supabase.from('amenities').insert(amenity).select().single();
      if (error) throw error;
      setFacilities(prev => [...prev, data]);
      toast.success('Amenity added');
    } catch (error) {
      console.error('Error adding amenity', error);
      toast.error('Failed to add amenity');
    }
  };

  const deleteAmenity = async (id: string) => {
    try {
      const { error } = await supabase.from('amenities').delete().eq('id', id);
      if (error) throw error;
      setFacilities(prev => prev.filter(f => f.id !== id));
      toast.success('Amenity deleted');
    } catch (error) {
      console.error('Error deleting amenity', error);
      toast.error('Failed to delete amenity');
    }
  };

  const updateSettings = async (data: Partial<SiteSettings>) => {
    // TODO: Implement settings update via site_content table
    setSettings(prev => ({ ...prev, ...data }));
  };

  const getTotalRooms = () => {
    return locations.reduce((acc, loc) => {
      return acc + loc.floors.reduce((fAcc, floor) => fAcc + floor.rooms.length, 0);
    }, 0);
  };

  const getTotalBeds = () => {
    return locations.reduce((acc, loc) => {
      return acc + loc.floors.reduce((fAcc, floor) => {
        return fAcc + floor.rooms.reduce((rAcc, room) => rAcc + room.beds.length, 0);
      }, 0);
    }, 0);
  };

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <DataContext.Provider value={{
      locations,
      facilities,
      settings,
      updateLocation,
      addFloor,
      updateFloor,
      deleteFloor,
      addRoom,
      updateRoom,
      deleteRoom,
      addBed,
      updateBed,
      deleteBed,
      updateSettings,
      getTotalRooms,
      getTotalBeds,
      refreshData,
      benefits,
      addBenefit,
      updateBenefit,
      deleteBenefit,
      addAmenity,
      deleteAmenity
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
