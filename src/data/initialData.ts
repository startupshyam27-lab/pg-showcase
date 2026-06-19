import { PGLocation, Facility, SiteSettings } from '@/types/pg';

export const initialFacilities: Facility[] = [
  { id: '1', name: 'TV', icon: 'Tv' },
  { id: '2', name: 'Wi-Fi', icon: 'Wifi' },
  { id: '3', name: 'Fridge', icon: 'Refrigerator' },
  { id: '4', name: 'RO Water', icon: 'Droplets' },
  { id: '5', name: 'Kitchen', icon: 'ChefHat' },
  { id: '6', name: 'Bed', icon: 'Bed' },
  { id: '7', name: 'Cupboard', icon: 'Archive' },
  { id: '8', name: 'Laundry', icon: 'WashingMachine' },
  { id: '9', name: 'Cleaning', icon: 'Sparkles' },
];

export const initialLocations: PGLocation[] = [
  {
    id: 'akruti',
    name: 'Akruti PG',
    slug: 'akruti-pg',
    propertyType: 'bungalow',
    description: 'A spacious bungalow-style PG with modern amenities, homely environment, and 24/7 security. Perfect for students and working professionals seeking comfort and convenience.',
    address: '123 Main Street, Sector 15, City - 400001',
    mapUrl: 'https://maps.google.com/?q=19.0760,72.8777',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    image: '',
    floors: [
      {
        id: 'akruti-gf',
        name: 'Ground Floor',
        rooms: [
          {
            id: 'akruti-gf-a',
            code: 'A',
            gender: 'boys',
            isVisible: true,
            beds: [
              { id: 'bed-1', label: 'Bed 1', price: 4000 },
              { id: 'bed-2', label: 'Bed 2', price: 4000 },
              { id: 'bed-3', label: 'Bed 3', price: 4200 },
            ],
          },
          {
            id: 'akruti-gf-b',
            code: 'B',
            gender: 'girls',
            isVisible: true,
            beds: [
              { id: 'bed-4', label: 'Bed 1', price: 4500 },
              { id: 'bed-5', label: 'Bed 2', price: 4500 },
            ],
          },
        ],
      },
      {
        id: 'akruti-1f',
        name: '1st Floor',
        rooms: [
          {
            id: 'akruti-1f-c',
            code: 'C',
            gender: 'boys',
            isVisible: true,
            beds: [
              { id: 'bed-6', label: 'Bed 1', price: 3800 },
              { id: 'bed-7', label: 'Bed 2', price: 3800 },
              { id: 'bed-8', label: 'Bed 3', price: 4000 },
              { id: 'bed-9', label: 'Bed 4', price: 4000 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'nilmani',
    name: 'Nilmani PG',
    slug: 'nilmani-pg',
    propertyType: 'flat',
    description: 'A modern flat-style PG offering premium living experience with all essential amenities. Ideal for those who prefer a compact yet comfortable living space.',
    address: '456 Park Avenue, Sector 22, City - 400002',
    mapUrl: 'https://maps.google.com/?q=19.0860,72.8877',
    phone: '+91 98765 43211',
    whatsapp: '+91 98765 43211',
    image: '',
    floors: [
      {
        id: 'nilmani-f1',
        name: 'Main Floor',
        rooms: [
          {
            id: 'nilmani-f1-a',
            code: 'A',
            gender: 'girls',
            isVisible: true,
            beds: [
              { id: 'bed-10', label: 'Bed 1', price: 5000 },
              { id: 'bed-11', label: 'Bed 2', price: 5000 },
            ],
          },
          {
            id: 'nilmani-f1-b',
            code: 'B',
            gender: 'boys',
            isVisible: true,
            beds: [
              { id: 'bed-12', label: 'Bed 1', price: 4800 },
              { id: 'bed-13', label: 'Bed 2', price: 4800 },
              { id: 'bed-14', label: 'Bed 3', price: 5000 },
            ],
          },
        ],
      },
    ],
  },
];

export const initialSettings: SiteSettings = {
  heroTitle: 'Premium & Affordable PG in Vastrapur, Ahmedabad',
  heroSubtitle: "",
  footerText: '© 2024 PG Homes. All rights reserved.',
};
