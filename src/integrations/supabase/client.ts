import { createClient } from '@supabase/supabase-js';
import { initialLocations, initialFacilities } from '@/data/initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch (_) {
    return false;
  }
};

// Helper to map camelCase location structure to snake_case structure expected by DataContext.tsx
const mapLocationToSnakeCase = (loc: any) => ({
  ...loc,
  property_type: loc.propertyType,
  map_url: loc.mapUrl,
  floors: loc.floors?.map((floor: any) => ({
    ...floor,
    rooms: floor.rooms?.map((room: any) => ({
      ...room,
      is_visible: room.isVisible,
      beds: room.beds
    }))
  }))
});

class MockQueryBuilder {
  private tableName: string;
  private filterCol: string | null = null;
  private filterVal: any = null;
  private orderCol: string | null = null;
  private orderAsc = true;
  private isSingle = false;
  private action: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select';
  private actionValue: any = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getTableData(): any[] {
    const raw = localStorage.getItem(`mock_db_${this.tableName}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (this.tableName === 'site_content') {
          const subtitleItem = parsed.find((item: any) => item.key === 'hero_subtitle');
          if (subtitleItem && subtitleItem.value && subtitleItem.value.includes("Fully furnished co-living spaces")) {
            subtitleItem.value = "";
            localStorage.setItem('mock_db_site_content', JSON.stringify(parsed));
          }
        }
        if (this.tableName === 'locations') {
          const hasOldData = parsed.some((item: any) => item.address && item.address.includes("123 Main Street"));
          if (hasOldData) {
            localStorage.removeItem('mock_db_locations');
            return initialLocations;
          }
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse mock db table', this.tableName, e);
      }
    }

    // Set initial values
    let initial: any[] = [];
    if (this.tableName === 'locations') {
      initial = initialLocations;
    } else if (this.tableName === 'benefits') {
      initial = [
        { id: '1', title: 'Affordable Pricing', description: 'Competitive rates with no hidden charges', created_at: new Date().toISOString() },
        { id: '2', title: 'Prime Locations', description: 'Well-connected areas with easy access', created_at: new Date().toISOString() },
        { id: '3', title: 'Modern Amenities', description: 'All facilities for comfortable living', created_at: new Date().toISOString() },
        { id: '4', title: '24/7 Security', description: 'Safe and secure environment always', created_at: new Date().toISOString() }
      ];
    } else if (this.tableName === 'amenities') {
      initial = initialFacilities;
    } else if (this.tableName === 'site_content') {
      initial = [
        { key: 'hero_title', value: 'Find Your Perfect PG Home', type: 'text', group: 'settings' },
        { key: 'hero_subtitle', value: 'Comfortable, affordable, and well-maintained paying guest accommodations with all modern amenities.', type: 'text', group: 'settings' },
        { key: 'footer_text', value: '© 2024 PG Homes. All rights reserved.', type: 'text', group: 'settings' },
        { key: 'hero_cta_primary', value: 'View Our PGs', type: 'link', group: 'settings' },
        { key: 'hero_cta_secondary', value: 'Contact Us', type: 'link', group: 'settings' },
        { key: 'header_call_btn', value: 'Call Now', type: 'text', group: 'settings' },
        { key: 'header_whatsapp_btn', value: 'WhatsApp Us', type: 'text', group: 'settings' },
        { key: 'footer_description', value: 'Affordable and well-maintained paying guest accommodations.', type: 'text', group: 'settings' },
        { key: 'footer_copyright', value: '© 2024 PG Homes. All rights reserved.', type: 'text', group: 'settings' }
      ];
    }
    localStorage.setItem(`mock_db_${this.tableName}`, JSON.stringify(initial));
    return initial;
  }

  private saveTableData(data: any[]) {
    localStorage.setItem(`mock_db_${this.tableName}`, JSON.stringify(data));
  }

  select(columns?: string) {
    this.action = 'select';
    return this;
  }

  insert(values: any) {
    this.action = 'insert';
    this.actionValue = values;
    return this;
  }

  update(values: any) {
    this.action = 'update';
    this.actionValue = values;
    return this;
  }

  upsert(values: any) {
    this.action = 'upsert';
    this.actionValue = values;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    this.filterCol = column;
    this.filterVal = value;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAsc = options?.ascending !== false;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  // Promise resolution triggers execution
  async then(onfulfilled?: (value: any) => any) {
    try {
      const result = await this.execute();
      if (onfulfilled) {
        return onfulfilled(result);
      }
      return result;
    } catch (e: any) {
      if (onfulfilled) {
        return onfulfilled({ data: null, error: e });
      }
      return { data: null, error: e };
    }
  }

  private async execute() {
    // 1. SELECT action
    if (this.action === 'select') {
      let data = this.getTableData();

      // Apply filtering
      if (this.filterCol && this.filterVal !== null) {
        data = data.filter(row => row[this.filterCol!] === this.filterVal);
      }

      // Apply ordering
      if (this.orderCol) {
        data = [...data].sort((a, b) => {
          const valA = a[this.orderCol!];
          const valB = b[this.orderCol!];
          if (valA < valB) return this.orderAsc ? -1 : 1;
          if (valA > valB) return this.orderAsc ? 1 : -1;
          return 0;
        });
      }

      // Transform table outputs
      if (this.tableName === 'locations') {
        data = data.map(mapLocationToSnakeCase);
      }

      let finalData: any = data;
      if (this.isSingle) {
        finalData = data.length > 0 ? data[0] : null;
      }

      return { data: finalData, error: null };
    }

    // 2. INSERT action
    if (this.action === 'insert') {
      const tableData = this.getTableData();
      const rowsToInsert = Array.isArray(this.actionValue) ? this.actionValue : [this.actionValue];
      const insertedRows: any[] = [];

      for (const row of rowsToInsert) {
        const newRow = {
          id: row.id || `mock-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
          ...row
        };

        if (this.tableName === 'floors') {
          const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
          const loc = locations.find((l: any) => l.id === newRow.location_id);
          if (loc) {
            loc.floors = loc.floors || [];
            loc.floors.push({
              id: newRow.id,
              name: newRow.name,
              rooms: []
            });
            localStorage.setItem('mock_db_locations', JSON.stringify(locations));
          }
        } else if (this.tableName === 'rooms') {
          const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
          let roomAdded = false;
          for (const loc of locations) {
            const floor = loc.floors?.find((f: any) => f.id === newRow.floor_id);
            if (floor) {
              floor.rooms = floor.rooms || [];
              floor.rooms.push({
                id: newRow.id,
                code: newRow.code,
                gender: newRow.gender,
                isVisible: newRow.is_visible !== false,
                beds: []
              });
              roomAdded = true;
              break;
            }
          }
          if (roomAdded) {
            localStorage.setItem('mock_db_locations', JSON.stringify(locations));
          }
        } else if (this.tableName === 'beds') {
          const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
          let bedAdded = false;
          for (const loc of locations) {
            for (const floor of (loc.floors || [])) {
              const room = floor.rooms?.find((r: any) => r.id === newRow.room_id);
              if (room) {
                room.beds = room.beds || [];
                room.beds.push({
                  id: newRow.id,
                  label: newRow.label,
                  price: Number(newRow.price)
                });
                bedAdded = true;
                break;
              }
            }
            if (bedAdded) break;
          }
          if (bedAdded) {
            localStorage.setItem('mock_db_locations', JSON.stringify(locations));
          }
        } else {
          tableData.push(newRow);
          this.saveTableData(tableData);
        }

        insertedRows.push(newRow);
      }

      const finalData = this.isSingle || !Array.isArray(this.actionValue) ? insertedRows[0] : insertedRows;
      return { data: finalData, error: null };
    }

    // 3. UPDATE action
    if (this.action === 'update') {
      const tableData = this.getTableData();
      let updatedRows: any[] = [];
      const values = this.actionValue;

      if (this.tableName === 'locations') {
        const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
        const locIndex = locations.findIndex((l: any) => l.id === this.filterVal);
        if (locIndex !== -1) {
          const mappedValues = { ...values };
          if (mappedValues.property_type !== undefined) {
            mappedValues.propertyType = mappedValues.property_type;
            delete mappedValues.property_type;
          }
          if (mappedValues.map_url !== undefined) {
            mappedValues.mapUrl = mappedValues.map_url;
            delete mappedValues.map_url;
          }

          locations[locIndex] = {
            ...locations[locIndex],
            ...mappedValues
          };
          localStorage.setItem('mock_db_locations', JSON.stringify(locations));
          updatedRows.push(locations[locIndex]);
        }
      } else if (this.tableName === 'floors') {
        const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
        let updated = false;
        for (const loc of locations) {
          const floor = loc.floors?.find((f: any) => f.id === this.filterVal);
          if (floor) {
            Object.assign(floor, values);
            updated = true;
            updatedRows.push(floor);
            break;
          }
        }
        if (updated) {
          localStorage.setItem('mock_db_locations', JSON.stringify(locations));
        }
      } else if (this.tableName === 'rooms') {
        const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
        let updated = false;
        for (const loc of locations) {
          for (const floor of (loc.floors || [])) {
            const room = floor.rooms?.find((r: any) => r.id === this.filterVal);
            if (room) {
              const mappedValues = { ...values };
              if (mappedValues.is_visible !== undefined) {
                mappedValues.isVisible = mappedValues.is_visible;
                delete mappedValues.is_visible;
              }
              Object.assign(room, mappedValues);
              updated = true;
              updatedRows.push(room);
              break;
            }
          }
          if (updated) break;
        }
        if (updated) {
          localStorage.setItem('mock_db_locations', JSON.stringify(locations));
        }
      } else if (this.tableName === 'beds') {
        const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
        let updated = false;
        for (const loc of locations) {
          for (const floor of (loc.floors || [])) {
            for (const room of (floor.rooms || [])) {
              const bed = room.beds?.find((b: any) => b.id === this.filterVal);
              if (bed) {
                Object.assign(bed, values);
                updated = true;
                updatedRows.push(bed);
                break;
              }
            }
            if (updated) break;
          }
          if (updated) break;
        }
        if (updated) {
          localStorage.setItem('mock_db_locations', JSON.stringify(locations));
        }
      } else {
        let updated = false;
        const updatedTable = tableData.map(row => {
          if (this.filterCol && row[this.filterCol] === this.filterVal) {
            const newRow = { ...row, ...values };
            updatedRows.push(newRow);
            updated = true;
            return newRow;
          }
          return row;
        });
        if (updated) {
          this.saveTableData(updatedTable);
        }
      }

      const finalData = this.isSingle ? (updatedRows[0] || null) : updatedRows;
      return { data: finalData, error: null };
    }

    // 4. UPSERT action
    if (this.action === 'upsert') {
      const tableData = this.getTableData();
      const rowsToUpsert = Array.isArray(this.actionValue) ? this.actionValue : [this.actionValue];
      const upsertedRows: any[] = [];

      if (this.tableName === 'site_content') {
        const updatedTable = [...tableData];
        for (const row of rowsToUpsert) {
          const index = updatedTable.findIndex(r => r.key === row.key);
          if (index !== -1) {
            updatedTable[index] = { ...updatedTable[index], ...row };
            upsertedRows.push(updatedTable[index]);
          } else {
            const newRow = { ...row };
            updatedTable.push(newRow);
            upsertedRows.push(newRow);
          }
        }
        this.saveTableData(updatedTable);
      }

      const finalData = this.isSingle || !Array.isArray(this.actionValue) ? upsertedRows[0] : upsertedRows;
      return { data: finalData, error: null };
    }

    // 5. DELETE action
    if (this.action === 'delete') {
      const tableData = this.getTableData();

      if (this.tableName === 'floors') {
        const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
        let deleted = false;
        for (const loc of locations) {
          if (loc.floors) {
            const initialLen = loc.floors.length;
            loc.floors = loc.floors.filter((f: any) => f.id !== this.filterVal);
            if (loc.floors.length < initialLen) {
              deleted = true;
              break;
            }
          }
        }
        if (deleted) {
          localStorage.setItem('mock_db_locations', JSON.stringify(locations));
        }
      } else if (this.tableName === 'rooms') {
        const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
        let deleted = false;
        for (const loc of locations) {
          for (const floor of (loc.floors || [])) {
            if (floor.rooms) {
              const initialLen = floor.rooms.length;
              floor.rooms = floor.rooms.filter((r: any) => r.id !== this.filterVal);
              if (floor.rooms.length < initialLen) {
                deleted = true;
                break;
              }
            }
          }
          if (deleted) break;
        }
        if (deleted) {
          localStorage.setItem('mock_db_locations', JSON.stringify(locations));
        }
      } else if (this.tableName === 'beds') {
        const locations = JSON.parse(localStorage.getItem('mock_db_locations') || '[]');
        let deleted = false;
        for (const loc of locations) {
          for (const floor of (loc.floors || [])) {
            for (const room of (floor.rooms || [])) {
              if (room.beds) {
                const initialLen = room.beds.length;
                room.beds = room.beds.filter((b: any) => b.id !== this.filterVal);
                if (room.beds.length < initialLen) {
                  deleted = true;
                  break;
                }
              }
            }
            if (deleted) break;
          }
          if (deleted) break;
        }
        if (deleted) {
          localStorage.setItem('mock_db_locations', JSON.stringify(locations));
        }
      } else {
        if (this.filterCol && this.filterVal !== null) {
          const filteredTable = tableData.filter(row => row[this.filterCol!] !== this.filterVal);
          this.saveTableData(filteredTable);
        }
      }

      return { error: null };
    }

    return { data: null, error: new Error('Unknown database action') };
  }
}

// Mock Storage Implementation (Base64 file serializer)
const mockStorage = {
  from: (bucketName: string) => ({
    upload: async (filePath: string, file: File) => {
      return new Promise<any>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            localStorage.setItem(`mock_storage_${bucketName}_${filePath}`, reader.result as string);
            resolve({ data: { path: filePath }, error: null });
          } catch (e) {
            resolve({ data: null, error: new Error('Storage limit reached or failed to write file to localStorage') });
          }
        };
        reader.onerror = () => {
          resolve({ data: null, error: new Error('Failed to read file') });
        };
        reader.readAsDataURL(file);
      });
    },
    getPublicUrl: (filePath: string) => {
      const stored = localStorage.getItem(`mock_storage_${bucketName}_${filePath}`);
      return {
        data: {
          publicUrl: stored || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'
        }
      };
    }
  })
};

let supabaseInstance: any;

// Use real client only if env vars are present, start with HTTP/HTTPS (to exclude default placeholders), and are not local placeholders
if (isValidUrl(supabaseUrl) && supabaseKey && supabaseUrl !== 'YOUR_NEW_SUPABASE_URL' && supabaseKey !== 'YOUR_NEW_SUPABASE_ANON_KEY') {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize real Supabase client, falling back to mock:', err);
  }
}

if (!supabaseInstance) {
  console.warn('VITE_SUPABASE_URL is not configured or invalid. Falling back to local storage mock database.');
  supabaseInstance = {
    from: (tableName: string) => {
      return new MockQueryBuilder(tableName);
    },
    storage: mockStorage
  };
}

export const supabase = supabaseInstance;
