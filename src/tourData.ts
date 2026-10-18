// src/data/tourData.ts

// 1. Interface
export interface Place {
  name: string;
  description: string;
  images: string[];
}

export interface TourOption {
  name: string;
  description: string;
  price?: string;
  places: Place[];
}

export interface TourPackage {
  id: number;
  title: string;
  price: string;
  duration: string;
  images: string[];
  description?: string;
  options: TourOption[];
}

// 2. Shared Images
const monkeyForestImages = [
  'https://images.unsplash.com/photo-1677422238313-6e87757470fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const riceTerraceImages = [
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1680094513147-a9b7ce9b209b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const coffeePlantationImages = [
  'https://images.unsplash.com/photo-1624935920936-f09b9803faf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const waterTempleImages = [
  'https://images.unsplash.com/photo-1680094513147-a9b7ce9b209b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1677422238313-6e87757470fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const waterfallImages = [
  'https://images.unsplash.com/photo-1564462369738-d479ed4f1274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1680094513147-a9b7ce9b209b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const ubudPalaceImages = [
  'https://images.unsplash.com/photo-1708436137498-1b660e94c782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1646020943475-9f341cd32f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const lempuyangImages = [
  'https://images.unsplash.com/photo-1668718772169-31f6ecac0b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1687859846973-56a5894530bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const tirtaGanggaImages = [
  'https://images.unsplash.com/photo-1687859846973-56a5894530bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1707688581330-1353a787ddbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const lahanganSweetImages = [
  'https://images.unsplash.com/photo-1707688581330-1353a787ddbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1717501787981-d5f28eb2df5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const virginBeachImages = [
  'https://images.unsplash.com/photo-1670769485743-44fadae5c190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1717501787981-d5f28eb2df5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const penelokanImages = [
  'https://images.unsplash.com/photo-1644496517850-9e3a7a888aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1643718152079-23db5fd123a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const besakihImages = [
  'https://images.unsplash.com/photo-1655289112205-d3b56c6b61f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1680094513147-a9b7ce9b209b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];


const tanahLotImages = [
  'https://images.unsplash.com/photo-1555865138-193ba536d7e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1680094513147-a9b7ce9b209b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const uluwatuImages = [
  'https://images.unsplash.com/photo-1604842937136-1648761a6256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const traditionalMarketImages = [
  'https://images.unsplash.com/photo-1646020943475-9f341cd32f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1708436137498-1b660e94c782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

// 3. Main Data
export const tourPackages: TourPackage[] = [
  {
    id: 1,
    title: 'FULL DAY UBUD',
    duration: '9 hours',
    price: 'IDR 700K',
    images: monkeyForestImages,
    options: [
      {
        name: 'Option 1',
        description: 'Monkey Forest, Rice Terrace, Coffee Plantation, Water Temple, Traditional Painting, Tegenungan Waterfall',
        price: 'Rp 800K-1.1 Juta',
        places: [
          { name: 'Monkey Forest', description: 'Sacred forest sanctuary...', images: monkeyForestImages },
          { name: 'Rice Terrace', description: 'Iconic stepped rice paddies...', images: riceTerraceImages },
          { name: 'Coffee Plantation', description: 'Traditional Bali coffee farm...', images: coffeePlantationImages },
          { name: 'Water Temple', description: 'Holy spring water purification...', images: waterTempleImages },
          { name: 'Traditional Painting', description: 'Local Balinese art gallery...', images: ubudPalaceImages },
          { name: 'Tegenungan Waterfall', description: 'Powerful jungle waterfall...', images: waterfallImages },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'FULL DAY EAST',
    duration: '9 hours',
    price: 'IDR 800K',
    images: lempuyangImages,
    options: [
      {
        name: 'Option 1',
        description: 'Lempuyang, Tirta Gangga, Lahangan Sweet, Virgin Beach, Tukad Cepung Waterfall',
        price: 'Rp 900K-1.2 Juta',
        places: [
          { name: 'Lempuyang Temple', description: 'Famous Gates of Heaven...', images: lempuyangImages },
          { name: 'Tirta Gangga', description: 'Former royal water palace...', images: tirtaGanggaImages },
          { name: 'Lahangan Sweet', description: 'Stunning viewpoint...', images: lahanganSweetImages },
          { name: 'Virgin Beach', description: 'Secluded white sand beach...', images: virginBeachImages },
          { name: 'Tukad Cepung Waterfall', description: 'Hidden cave waterfall...', images: waterfallImages },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'FULL DAY NORTH',
    duration: '9 hours',
    price: 'IDR 750K',
    images: penelokanImages,
    options: [
      {
        name: 'Option 1',
        description: 'Rice Terrace, Coffee Plantation, Water Temple, Penelokan View, Batur Temple, Besakih Temple',
        places: [
          { name: 'Rice Terrace', description: 'Iconic stepped rice paddies...', images: riceTerraceImages },
          { name: 'Coffee Plantation', description: 'Traditional Bali coffee farm...', images: coffeePlantationImages },
          { name: 'Water Temple', description: 'Holy spring water purification...', images: waterTempleImages },
          { name: 'Penelokan View', description: 'Panoramic volcano view...', images: penelokanImages },
          { name: 'Batur Temple', description: 'Sacred mountain temple...', images: penelokanImages },
          { name: 'Besakih Temple', description: 'Mother temple of Bali...', images: besakihImages },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'HALF DAY TOUR',
    duration: '5 hours',
    price: 'IDR 500K',
    images: tanahLotImages,
    options: [
      {
        name: 'Option 1',
        description: 'Tanah Lot Temple & Sunset',
        places: [
          { name: 'Tanah Lot Temple', description: 'Iconic sea temple...', images: tanahLotImages },
        ],
      },
      {
        name: 'Option 2',
        description: 'Uluwatu Temple & Kecak Dance',
        places: [
          { name: 'Uluwatu Temple', description: 'Cliffside ocean temple...', images: uluwatuImages },
          { name: 'Kecak Fire Dance', description: 'Traditional Balinese performance...', images: uluwatuImages },
        ],
      },
      {
        name: 'Option 3',
        description: 'Monkey Forest, Ubud Palace, Traditional Market',
        places: [
          { name: 'Monkey Forest', description: 'Sacred forest sanctuary...', images: monkeyForestImages },
          { name: 'Ubud Palace', description: 'Royal heritage palace...', images: ubudPalaceImages },
          { name: 'Traditional Market', description: 'Local cultural market...', images: traditionalMarketImages },
        ],
      },
    ],
  },
];
