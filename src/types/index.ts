export interface Destination {
  _id: string;
  name: string;
  description: string;
  country: string;
  photo?: string | null;
  bestTimeToVisit?: string | null;
  visaRequirements?: string | null;
  studentVisa?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationInput {
  name: string;
  description: string;
  country: string;
  photo?: string | null;
  bestTimeToVisit?: string | null;
  visaRequirements?: string | null;
  studentVisa?: string | null;
}

export interface DestinationUpdateInput {
  name?: string;
  description?: string;
  country?: string;
  photo?: string[];
  bestTimeToVisit?: string | null;
  visaRequirements?: string | null;
  studentVisa?: string | null;
}

export interface University {
  _id: string;
  name: string;
  description: string;
  location: string;
  destinationId: string;
  establishedYear?: number;
  website?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityInput {
  name: string;
  description: string;
  location: string;
  destinationId: string;
  establishedYear?: number;
  website?: string;
  photo?: string;
}

export interface UniversityUpdateInput {
  name?: string;
  description?: string;
  location?: string;
  destinationId?: string;
  establishedYear?: number;
  website?: string;
  photo?: string;
}
