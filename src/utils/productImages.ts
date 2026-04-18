import mensFormal1 from '@/assets/products/mens-formal-1.jpg';
import mensCasual1 from '@/assets/products/mens-casual-1.jpg';
import mensSports1 from '@/assets/products/mens-sports-1.jpg';
import mensSandal1 from '@/assets/products/mens-sandal-1.jpg';
import womensHeels1 from '@/assets/products/womens-heels-1.jpg';
import womensFlats1 from '@/assets/products/womens-flats-1.jpg';
import womensSports1 from '@/assets/products/womens-sports-1.jpg';
import kidsSchool1 from '@/assets/products/kids-school-1.jpg';
import kidsSports1 from '@/assets/products/kids-sports-1.jpg';
import kidsParty1 from '@/assets/products/kids-party-1.jpg';
import accessory1 from '@/assets/products/accessory-1.jpg';
import accessorySocks from '@/assets/products/accessory-socks.jpg';
import accessoryInsoles from '@/assets/products/accessory-insoles.jpg';

const imageMap: Record<string, string> = {
  'mens-formal-1': mensFormal1,
  'mens-casual-1': mensCasual1,
  'mens-sports-1': mensSports1,
  'mens-sandal-1': mensSandal1,
  'womens-heels-1': womensHeels1,
  'womens-flats-1': womensFlats1,
  'womens-sports-1': womensSports1,
  'kids-school-1': kidsSchool1,
  'kids-sports-1': kidsSports1,
  'kids-party-1': kidsParty1,
  'accessory-1': accessory1,
  'accessory-socks': accessorySocks,
  'accessory-insoles': accessoryInsoles,
};

export const getProductImage = (key: string): string => {
  return imageMap[key] || mensFormal1;
};
