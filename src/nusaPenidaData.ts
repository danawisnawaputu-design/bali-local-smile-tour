export interface ItineraryItem {
  time: string;
  activity: string;
}

export interface NusaPenidaPackage {
  id: number;
  name: string;
  price: string;
  images: string[];
  duration?: string;
  itinerary: ItineraryItem[];
  facilities: string[];
}

export const defaultNusaPenidaPackages: NusaPenidaPackage[] = [
  {
    id: 1,
    name: 'West Nusa Penida Tour',
    price: 'IDR 650K',
    images: [
      'https://images.unsplash.com/photo-1604430289156-3256783c3ef6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1725074126862-d839feb2122d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1685206033446-44ecdef99034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    itinerary: [
      { time: '06:00', activity: 'Pick up from hotel' },
      { time: '07:00', activity: 'Depart from Sanur Harbor' },
      { time: '08:00', activity: 'Arrive at Nusa Penida' },
      { time: '09:00', activity: 'Kelingking Beach (T-Rex viewpoint)' },
      { time: '11:00', activity: 'Angels Billabong & Broken Beach' },
      { time: '13:00', activity: 'Lunch with ocean view' },
      { time: '14:30', activity: 'Crystal Bay Beach' },
      { time: '16:00', activity: 'Return to harbor' },
      { time: '17:00', activity: 'Arrive Sanur & transfer to hotel' },
    ],
    facilities: ['Fast Boat Round Trip', 'Private Car & Driver', 'Lunch', 'Entrance Tickets', 'Mineral Water', 'Travel Insurance']
  },
  {
    id: 2,
    name: 'East Nusa Penida Tour',
    price: 'IDR 700K',
    images: [
      'https://images.unsplash.com/photo-1747873203056-5c4807684bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1654703943084-865d930b0055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1604500943879-80a4da030905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    itinerary: [
      { time: '06:00', activity: 'Pick up from hotel' },
      { time: '07:00', activity: 'Depart from Sanur Harbor' },
      { time: '08:00', activity: 'Arrive at Nusa Penida' },
      { time: '09:00', activity: 'Diamond Beach' },
      { time: '11:00', activity: 'Atuh Beach & Rumah Pohon Treehouse' },
      { time: '13:00', activity: 'Local restaurant lunch' },
      { time: '14:30', activity: 'Teletubbies Hills' },
      { time: '16:00', activity: 'Return to harbor' },
      { time: '17:00', activity: 'Arrive Sanur & transfer to hotel' },
    ],
    facilities: ['Fast Boat Round Trip', 'Private Car & Driver', 'Lunch', 'Entrance Tickets', 'Mineral Water', 'Travel Insurance']
  },
  {
    id: 3,
    name: 'Combination West + East Tour',
    price: 'IDR 1,200K',
    duration: '2 Days 1 Night',
    images: [
      'https://images.unsplash.com/photo-1604430289156-3256783c3ef6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1654703943084-865d930b0055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1725074126862-d839feb2122d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1685206033446-44ecdef99034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    itinerary: [
      { time: 'DAY 1', activity: 'West Tour - Kelingking, Angels Billabong, Broken Beach, Crystal Bay' },
      { time: 'Evening', activity: 'Check-in at local guesthouse' },
      { time: 'DAY 2', activity: 'East Tour - Diamond Beach, Atuh Beach, Teletubbies Hills' },
      { time: 'Afternoon', activity: 'Return to Bali' },
    ],
    facilities: ['Fast Boat Round Trip', 'Private Car & Driver', '2x Lunch', 'Accommodation (1 night)', 'All Entrance Tickets', 'Mineral Water', 'Travel Insurance']
  },
];
