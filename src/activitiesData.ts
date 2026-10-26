export interface Activity {
  id: number;
  title: string;
  images: string[];
  description: string;
}

export const activitiesData: Activity[] = [
  {
    id: 1,
    title: 'ATV Quad Bike',
    images: [
      'https://images.unsplash.com/photo-1542762002-45279e010961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Experience thrilling off-road adventure through Bali\'s scenic landscapes, muddy tracks, and jungle trails.'
  },
  {
    id: 2,
    title: 'Ayung River Rafting',
    images: [
      'https://images.unsplash.com/photo-1641584495098-49cfceabd8e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Navigate exciting rapids through the lush Ayung River valley with stunning jungle views and waterfalls.'
  },
  {
    id: 3,
    title: 'Ubud Bali Swing',
    images: [
      'https://images.unsplash.com/photo-1711241707155-ba44d6dfb630?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Soar above the jungle canopy on iconic swings with breathtaking views of rice terraces and palm forests.'
  },
  {
    id: 4,
    title: 'Sunrise Jeep & Trekking',
    images: [
      'https://images.unsplash.com/photo-1694920607725-3a445dc0892a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1643718152079-23db5fd123a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Witness spectacular sunrise at Mount Batur with an adventurous 4x4 jeep ride and volcanic landscape exploration.'
  },
  {
    id: 5,
    title: 'Cycling Tour',
    images: [
      'https://images.unsplash.com/photo-1728584800197-4a871101caf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Pedal through charming villages, emerald rice paddies, and traditional Balinese countryside.'
  },
  {
    id: 6,
    title: 'Cooking Class',
    images: [
      'https://images.unsplash.com/photo-1666239308345-c4c12ef3e177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Learn authentic Balinese cuisine with local chefs, from traditional market visits to hands-on cooking.'
  },
  {
    id: 7,
    title: 'Batik Class',
    images: [
      'https://images.unsplash.com/photo-1761516659491-bf9a672d64c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Create your own batik masterpiece learning traditional Indonesian wax-resist dyeing techniques.'
  },
  {
    id: 8,
    title: 'Silver Class',
    images: [
      'https://images.unsplash.com/photo-1761516659491-bf9a672d64c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Craft beautiful silver jewelry with skilled artisans in Bali\'s renowned silversmithing village of Celuk.'
  },
  {
    id: 9,
    title: 'Water Sport & Turtle Island',
    images: [
      'https://images.unsplash.com/photo-1718751944365-937aeb694d21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1717501787981-d5f28eb2df5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Enjoy parasailing, jet ski, banana boat, and visit turtle conservation island in crystal-clear waters.'
  },
  {
    id: 10,
    title: 'Zoo & Safari',
    images: [
      'https://images.unsplash.com/photo-1666234560154-5b8790490caa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Encounter exotic wildlife up close in a natural setting with interactive animal experiences for all ages.'
  },
  {
    id: 11,
    title: 'Elephant Sanctuary',
    images: [
      'https://images.unsplash.com/photo-1732272823287-024c713741f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: 'Connect with gentle giants in an ethical sanctuary, feed, bathe, and learn about elephant conservation.'
  },
];
