import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_NEW_SUPABASE')) {
  console.error('Please configure your valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file first.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const siteContent = [
  { key: 'hero_title', value: 'Premium & Affordable PG in Vastrapur, Ahmedabad', type: 'text', group: 'settings' },
  { key: 'hero_subtitle', value: "Fully furnished co-living spaces, boys' hostels, and girls' PGs with home-style food, high-speed Wi-Fi, and 24/7 security.", type: 'text', group: 'settings' },
  { key: 'footer_text', value: '© 2024 PG Homes. All rights reserved.', type: 'text', group: 'settings' },
  { key: 'hero_cta_primary', value: 'Book a Visit', type: 'link', group: 'settings' },
  { key: 'hero_cta_secondary', value: 'Check Room Availability', type: 'link', group: 'settings' },
  { key: 'header_call_btn', value: 'Book a Visit', type: 'text', group: 'settings' },
  { key: 'header_whatsapp_btn', value: 'WhatsApp Us', type: 'text', group: 'settings' },
  { key: 'footer_description', value: 'Affordable and well-maintained paying guest accommodations in Vastrapur, Ahmedabad.', type: 'text', group: 'settings' },
  { key: 'footer_copyright', value: '© 2024 PG Homes. All rights reserved.', type: 'text', group: 'settings' }
];

const benefits = [
  { title: 'Affordable Pricing', description: 'Competitive rates with no hidden charges' },
  { title: 'Prime Locations', description: 'Well-connected areas with easy access' },
  { title: 'Modern Amenities', description: 'All facilities for comfortable living' },
  { title: '24/7 Security', description: 'Safe and secure environment always' }
];

const initialLocationsData = [
  {
    name: 'Akruti PG',
    slug: 'akruti-pg',
    property_type: 'bungalow',
    description: 'A spacious bungalow-style PG with modern amenities, homely environment, and 24/7 security. Perfect for students and working professionals seeking comfort and convenience.',
    address: '123 Main Street, Sector 15, City - 400001',
    map_url: 'https://maps.google.com/?q=19.0760,72.8777',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
    gallery: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
    ],
    floors: [
      {
        name: 'Ground Floor',
        rooms: [
          {
            code: 'A',
            gender: 'boys',
            is_visible: true,
            beds: [
              { label: 'Bed 1', price: 4000 },
              { label: 'Bed 2', price: 4000 },
              { label: 'Bed 3', price: 4200 }
            ]
          },
          {
            code: 'B',
            gender: 'girls',
            is_visible: true,
            beds: [
              { label: 'Bed 1', price: 4500 },
              { label: 'Bed 2', price: 4500 }
            ]
          }
        ]
      },
      {
        name: '1st Floor',
        rooms: [
          {
            code: 'C',
            gender: 'boys',
            is_visible: true,
            beds: [
              { label: 'Bed 1', price: 3800 },
              { label: 'Bed 2', price: 3800 },
              { label: 'Bed 3', price: 4000 },
              { label: 'Bed 4', price: 4000 }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Nilmani PG',
    slug: 'nilmani-pg',
    property_type: 'flat',
    description: 'A modern flat-style PG offering premium living experience with all essential amenities. Ideal for those who prefer a compact yet comfortable living space.',
    address: '456 Park Avenue, Sector 22, City - 400002',
    map_url: 'https://maps.google.com/?q=19.0860,72.8877',
    phone: '+91 98765 43211',
    whatsapp: '+91 98765 43211',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'
    ],
    floors: [
      {
        name: 'Main Floor',
        rooms: [
          {
            code: 'A',
            gender: 'girls',
            is_visible: true,
            beds: [
              { label: 'Bed 1', price: 5000 },
              { label: 'Bed 2', price: 5000 }
            ]
          },
          {
            code: 'B',
            gender: 'boys',
            is_visible: true,
            beds: [
              { label: 'Bed 1', price: 4800 },
              { label: 'Bed 2', price: 4800 },
              { label: 'Bed 3', price: 5000 }
            ]
          }
        ]
      }
    ]
  }
];

async function seed() {
  console.log('Starting Supabase Seeding...');

  // 1. Seed Site Content
  console.log('Seeding site_content...');
  for (const content of siteContent) {
    const { error } = await supabase.from('site_content').upsert(content);
    if (error) console.error(`Error seeding site_content (${content.key}):`, error);
  }

  // 2. Seed Benefits
  console.log('Seeding benefits...');
  for (const benefit of benefits) {
    const { error } = await supabase.from('benefits').insert(benefit);
    if (error) console.error(`Error seeding benefit (${benefit.title}):`, error);
  }

  // 3. Seed Locations & Nested Hierarchy
  console.log('Seeding locations hierarchy...');
  for (const locData of initialLocationsData) {
    const { floors, ...locPayload } = locData;
    
    // Insert Location
    const { data: loc, error: locError } = await supabase
      .from('locations')
      .insert(locPayload)
      .select()
      .single();

    if (locError) {
      console.error(`Error inserting location (${locPayload.name}):`, locError);
      continue;
    }
    console.log(`Inserted Location: ${loc.name} (${loc.id})`);

    // Insert Floors
    for (const floorData of floors) {
      const { rooms, ...floorPayload } = floorData;
      const { data: floor, error: floorError } = await supabase
        .from('floors')
        .insert({ ...floorPayload, location_id: loc.id })
        .select()
        .single();

      if (floorError) {
        console.error(`Error inserting floor (${floorPayload.name}) for location ${loc.name}:`, floorError);
        continue;
      }

      // Insert Rooms
      for (const roomData of rooms) {
        const { beds, ...roomPayload } = roomData;
        const { data: room, error: roomError } = await supabase
          .from('rooms')
          .insert({ ...roomPayload, floor_id: floor.id })
          .select()
          .single();

        if (roomError) {
          console.error(`Error inserting room (${roomPayload.code}) for floor ${floor.name}:`, roomError);
          continue;
        }

        // Insert Beds
        for (const bedPayload of beds) {
          const { error: bedError } = await supabase
            .from('beds')
            .insert({ ...bedPayload, room_id: room.id });

          if (bedError) {
            console.error(`Error inserting bed (${bedPayload.label}) for room ${room.code}:`, bedError);
          }
        }
      }
    }
  }

  console.log('Database successfully seeded!');
}

seed().catch(err => {
  console.error('Seeding process failed:', err);
  process.exit(1);
});
