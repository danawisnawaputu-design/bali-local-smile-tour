export interface FastBoatSchedule {
  time: string;
  operator: string;
  price: string;
}

export interface FastBoatRoute {
  id: number;
  route: string;
  images: string[];
  schedules: FastBoatSchedule[];
  duration: string;
  description: string;
}

export const defaultFastBoatRoutes: FastBoatRoute[] = [
  {
    id: 1,
    route: 'Sanur ↔ Nusa Penida',
    images: [
      'https://images.unsplash.com/photo-1604500943879-80a4da030905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1628587935339-f7df1a63d6a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    schedules: [
      { time: '08:00', operator: 'Morning Express', price: '' },
      { time: '10:30', operator: 'Midday Fast Boat', price: '' },
      { time: '15:00', operator: 'Afternoon Cruise', price: ''},
    ],
    duration: '45 minutes',
    description: 'Fast boat connection between Sanur Beach and beautiful Nusa Penida island.'
  },
  {
    id: 2,
    route: 'Padang Bai ↔ Gili Islands',
    images: [
      'https://images.unsplash.com/photo-1650620598113-11edd267cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1628587935339-f7df1a63d6a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    schedules: [
      { time: '09:00', operator: 'Gili Express', price: '' },
      { time: '11:00', operator: 'Island Hopper', price: '' },
      { time: '14:30', operator: 'Sunset Cruiser', price: '' },
      { time: '16:00', operator: 'Evening Fast Boat', price: ''},
    ],
    duration: '1.5 hours',
    description: 'Convenient fast boat service to Gili Trawangan, Gili Meno, and Gili Air from Padang Bai port.'
  },
];
