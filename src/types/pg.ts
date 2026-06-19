export interface Bed {
  id: string;
  label: string;
  price: number;
}

export interface Room {
  id: string;
  code: string;
  gender: 'boys' | 'girls';
  beds: Bed[];
  isVisible: boolean;
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

export interface PGLocation {
  id: string;
  name: string;
  slug: string;
  propertyType: 'bungalow' | 'flat';
  description: string;
  address: string;
  mapUrl: string;
  phone: string;
  whatsapp: string;
  image: string;
  gallery: string[];
  floors: Floor[];
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
}
