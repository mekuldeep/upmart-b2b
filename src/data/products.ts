export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  category: 'men' | 'women' | 'kids' | 'accessories';
  subcategory: string;
  image: string;
  sizes: number[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
}

const brands = ['Rimco', 'Kodson', 'Supremelite', 'Paris', 'Decent', 'StonX', 'Aishwarya', 'Top-Gear', 'AXL'];

export const products: Product[] = [
  // MEN
  { id: 'm1', name: 'Classic Derby Formal Shoes', brand: 'Rimco', price: 1299, mrp: 2499, category: 'men', subcategory: 'Formal', image: 'mens-formal-1', sizes: [6,7,8,9,10], colors: ['Black','Brown'], description: 'Premium leather derby shoes perfect for office and formal occasions. Crafted with genuine leather upper and cushioned insole.', rating: 4.5, reviews: 128 },
  { id: 'm2', name: 'Leather Penny Loafers', brand: 'Kodson', price: 1099, mrp: 1999, category: 'men', subcategory: 'Casual', image: 'mens-casual-1', sizes: [6,7,8,9,10,11], colors: ['Brown','Tan'], description: 'Handcrafted penny loafers with premium leather. Perfect for semi-formal and casual wear.', rating: 4.3, reviews: 95 },
  { id: 'm3', name: 'Air Mesh Running Shoes', brand: 'StonX', price: 899, mrp: 1799, category: 'men', subcategory: 'Sports', image: 'mens-sports-1', sizes: [7,8,9,10,11], colors: ['White','Black','Grey'], description: 'Lightweight mesh running shoes with air cushion technology for maximum comfort during workouts.', rating: 4.6, reviews: 210 },
  { id: 'm4', name: 'Leather Thong Sandals', brand: 'Decent', price: 599, mrp: 1199, category: 'men', subcategory: 'Sandals', image: 'mens-sandal-1', sizes: [6,7,8,9,10], colors: ['Brown','Black'], description: 'Genuine leather thong sandals with anti-slip sole. Ideal for daily wear.', rating: 4.2, reviews: 76 },
  { id: 'm5', name: 'Executive Oxford Shoes', brand: 'Supremelite', price: 1599, mrp: 2999, category: 'men', subcategory: 'Formal', image: 'mens-formal-1', sizes: [7,8,9,10], colors: ['Black'], description: 'Premium Oxford shoes with Goodyear welt construction for durability and style.', rating: 4.7, reviews: 156 },
  { id: 'm6', name: 'Mesh Sport Trainers', brand: 'AXL', price: 799, mrp: 1599, category: 'men', subcategory: 'Sports', image: 'mens-sports-1', sizes: [6,7,8,9,10,11], colors: ['White','Blue'], description: 'Breathable mesh trainers with EVA midsole for everyday sports activities.', rating: 4.1, reviews: 89 },
  { id: 'm7', name: 'Driving Moccasins', brand: 'Paris', price: 999, mrp: 1899, category: 'men', subcategory: 'Casual', image: 'mens-casual-1', sizes: [7,8,9,10], colors: ['Brown','Navy'], description: 'Soft leather moccasins with rubber pebble sole. Perfect for driving and casual outings.', rating: 4.4, reviews: 112 },
  { id: 'm8', name: 'Comfort Flip Flops', brand: 'Top-Gear', price: 399, mrp: 799, category: 'men', subcategory: 'Sandals', image: 'mens-sandal-1', sizes: [6,7,8,9,10,11], colors: ['Black','Brown','Blue'], description: 'Memory foam flip flops with arch support for all-day comfort.', rating: 4.0, reviews: 200 },

  // WOMEN
  { id: 'w1', name: 'Strappy Block Heel Sandals', brand: 'Aishwarya', price: 1199, mrp: 2299, category: 'women', subcategory: 'Heels', image: 'womens-heels-1', sizes: [4,5,6,7,8], colors: ['Beige','Black'], description: 'Elegant strappy sandals with comfortable block heels. Perfect for parties and occasions.', rating: 4.5, reviews: 145 },
  { id: 'w2', name: 'Ballet Flat Bellies', brand: 'Paris', price: 699, mrp: 1399, category: 'women', subcategory: 'Flats', image: 'womens-flats-1', sizes: [4,5,6,7,8], colors: ['Pink','Beige','Black'], description: 'Soft cushioned ballet flats with bow detail. Ideal for daily office wear.', rating: 4.3, reviews: 178 },
  { id: 'w3', name: 'Running Sneakers', brand: 'StonX', price: 999, mrp: 1999, category: 'women', subcategory: 'Sports', image: 'womens-sports-1', sizes: [4,5,6,7,8], colors: ['White','Pink'], description: 'Lightweight running sneakers with breathable mesh upper and responsive cushioning.', rating: 4.6, reviews: 134 },
  { id: 'w4', name: 'Stiletto Heel Pumps', brand: 'Supremelite', price: 1499, mrp: 2799, category: 'women', subcategory: 'Heels', image: 'womens-heels-1', sizes: [4,5,6,7], colors: ['Black','Red'], description: 'Classic stiletto pumps with padded footbed. Elevate any outfit with these timeless heels.', rating: 4.4, reviews: 98 },
  { id: 'w5', name: 'Comfort Slip-On Mules', brand: 'Decent', price: 799, mrp: 1599, category: 'women', subcategory: 'Flats', image: 'womens-flats-1', sizes: [4,5,6,7,8], colors: ['Beige','White'], description: 'Easy slip-on mules with cushioned insole for everyday comfort.', rating: 4.2, reviews: 88 },
  { id: 'w6', name: 'Training Shoes', brand: 'AXL', price: 899, mrp: 1699, category: 'women', subcategory: 'Sports', image: 'womens-sports-1', sizes: [5,6,7,8], colors: ['White','Grey'], description: 'Versatile training shoes for gym and outdoor workouts.', rating: 4.3, reviews: 102 },

  // KIDS
  { id: 'k1', name: 'Velcro School Shoes', brand: 'Kodson', price: 599, mrp: 1199, category: 'kids', subcategory: 'School', image: 'kids-school-1', sizes: [8,9,10,11,12,13], colors: ['Black'], description: 'Durable school shoes with easy velcro closure. Built to last through active school days.', rating: 4.4, reviews: 220 },
  { id: 'k2', name: 'Colorful Sports Sneakers', brand: 'Top-Gear', price: 699, mrp: 1399, category: 'kids', subcategory: 'Sports', image: 'kids-sports-1', sizes: [9,10,11,12,13,1], colors: ['Multi'], description: 'Fun and colorful sports sneakers with excellent grip and cushioning for active kids.', rating: 4.5, reviews: 167 },
  { id: 'k3', name: 'Glitter Party Shoes', brand: 'Aishwarya', price: 799, mrp: 1499, category: 'kids', subcategory: 'Party', image: 'kids-party-1', sizes: [8,9,10,11,12], colors: ['Pink','Gold'], description: 'Sparkly party shoes that every kid will love. Comfortable and stylish for special occasions.', rating: 4.6, reviews: 134 },
  { id: 'k4', name: 'Canvas Sneakers', brand: 'Rimco', price: 499, mrp: 999, category: 'kids', subcategory: 'Casual', image: 'kids-sports-1', sizes: [9,10,11,12,13], colors: ['White','Blue'], description: 'Classic canvas sneakers for everyday wear. Easy to clean and maintain.', rating: 4.3, reviews: 189 },

  // ACCESSORIES
  { id: 'a1', name: 'Premium Shoe Care Kit', brand: 'Rimco', price: 499, mrp: 999, category: 'accessories', subcategory: 'Care', image: 'accessory-1', sizes: [], colors: [], description: 'Complete shoe care kit with polish, brush, and conditioner. Keep your shoes looking brand new.', rating: 4.7, reviews: 312 },
  { id: 'a2', name: 'Cotton Socks Pack (5 Pairs)', brand: 'Decent', price: 299, mrp: 599, category: 'accessories', subcategory: 'Socks', image: 'accessory-socks', sizes: [], colors: ['Multi'], description: 'Premium cotton socks in assorted colors. Breathable and comfortable for all-day wear.', rating: 4.4, reviews: 456 },
  { id: 'a3', name: 'Orthopedic Insoles', brand: 'StonX', price: 399, mrp: 799, category: 'accessories', subcategory: 'Insoles', image: 'accessory-insoles', sizes: [], colors: [], description: 'Medical-grade orthopedic insoles for arch support and pain relief. Fits most shoe sizes.', rating: 4.5, reviews: 234 },
  { id: 'a4', name: 'Shoe Deodorizer Spray', brand: 'Top-Gear', price: 199, mrp: 399, category: 'accessories', subcategory: 'Care', image: 'accessory-1', sizes: [], colors: [], description: 'Long-lasting shoe deodorizer that eliminates odor and keeps shoes fresh.', rating: 4.2, reviews: 178 },
];

export const getProductsByCategory = (category: string) =>
  products.filter(p => p.category === category);

export const getProductById = (id: string) =>
  products.find(p => p.id === id);

export const getProductsByBrand = (brand: string) =>
  products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());

export const getImageImport = (imageKey: string) => imageKey;
