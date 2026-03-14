// ================= TYPES =================
export type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

export type Variant = {
  id: string;
  color?: string;
  storage?: string;
  stock: number;
};

export type Category =
  | 'smartphone'
  | 'laptop'
  | 'tablet'
  | 'smartwatch'
  | 'audio'
  | 'gaming'
  | 'camera'
  | 'tv'
  | 'accessory'
  | 'home'
  | 'networking'
  | 'smart-home'
  | 'extra-tech';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Category;
  variants: Variant[];
  reviews: Review[];
};

// ================= HELPER VARIANTS =================

const generatePhoneVariants = (): Variant[] => [
  { id: 'v1', color: 'Black', storage: '128GB', stock: 5 },
  { id: 'v2', color: 'Silver', storage: '256GB', stock: 3 },
  { id: 'v3', color: 'Blue', storage: '512GB', stock: 0 },
];

const generateLaptopVariants = (): Variant[] => [
  { id: 'v1', storage: '512GB SSD', stock: 4 },
  { id: 'v2', storage: '1TB SSD', stock: 2 },
];

const defaultVariant = (): Variant[] => [{ id: 'v1', stock: 6 }];

const getVariantsByCategory = (category: Category): Variant[] => {
  if (category === 'smartphone') return generatePhoneVariants();
  if (category === 'laptop') return generateLaptopVariants();
  return defaultVariant();
};

// ================= SAMPLE REVIEWS =================
const SAMPLE_REVIEWS: Review[] = [
  { id: 'r1', user: 'Rahul Sharma', rating: 5, comment: 'Excellent product! Highly recommended.', date: '2025-01-12' },
  { id: 'r2', user: 'Ananya Singh', rating: 4, comment: 'Very good quality and worth the price.', date: '2025-01-18' },
  { id: 'r3', user: 'Karan Patel', rating: 3, comment: 'Decent product but could be improved.', date: '2025-01-22' },
];

// ================= BASE PRODUCTS (70+) =================
const BASE_PRODUCTS: Omit<Product, 'variants' | 'reviews'>[] = [
  { id: '1', name: 'iPhone 15 Pro', price: 129999, image: 'https://images.unsplash.com/photo-1695048133142-1a20484a3b43', description: 'Latest Apple flagship smartphone', category: 'smartphone' },
  { id: '2', name: 'Samsung Galaxy S24', price: 89999, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', description: 'Premium Android smartphone', category: 'smartphone' },
  { id: '3', name: 'Google Pixel 8 Pro', price: 94999, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', description: 'AI-powered Android smartphone', category: 'smartphone' },
  { id: '4', name: 'OnePlus 12', price: 69999, image: 'https://images.unsplash.com/photo-1603899122634-3d9f7b1d04c6', description: 'Flagship killer smartphone', category: 'smartphone' },
  { id: '5', name: 'Xiaomi 14 Ultra', price: 79999, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505', description: 'High-end camera smartphone', category: 'smartphone' },
  { id: '6', name: 'iPhone 15', price: 89999, image: 'https://images.unsplash.com/photo-1695048133142-1a20484a3b43', description: 'Apple latest generation smartphone', category: 'smartphone' },
  { id: '7', name: 'Samsung Galaxy S24 Ultra', price: 124999, image: 'https://images.unsplash.com/photo-1678911820864-e0c45a6a8f5a', description: 'Premium flagship with S-Pen support', category: 'smartphone' },
  { id: '8', name: 'Samsung Galaxy Z Fold 5', price: 154999, image: 'https://images.unsplash.com/photo-1693559389026-b1a0b36f72df', description: 'Foldable flagship smartphone', category: 'smartphone' },
  { id: '9', name: 'Samsung Galaxy Z Flip 5', price: 99999, image: 'https://images.unsplash.com/photo-1693559389026-b1a0b36f72df', description: 'Compact foldable smartphone', category: 'smartphone' },
  { id: '10', name: 'Google Pixel 8', price: 75999, image: 'https://images.unsplash.com/photo-1695048133142-1a20484a3b43', description: 'Smart AI-powered Android phone', category: 'smartphone' },
  { id: '11', name: 'Google Pixel 7a', price: 43999, image: 'https://images.unsplash.com/photo-1682686581498-5e98d7d5d1d7', description: 'Affordable Pixel with flagship features', category: 'smartphone' },
  { id: '12', name: 'OnePlus 11R', price: 39999, image: 'https://images.unsplash.com/photo-1603899122634-3d9f7b1d04c6', description: 'High-performance mid-range smartphone', category: 'smartphone' },
  { id: '13', name: 'Nothing Phone (2)', price: 44999, image: 'https://images.unsplash.com/photo-1682685797741-5e84eaf3a8bb', description: 'Unique transparent design smartphone', category: 'smartphone' },
  { id: '14', name: 'Xiaomi 13 Pro', price: 79999, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505', description: 'Leica-powered camera smartphone', category: 'smartphone' },
  { id: '15', name: 'Vivo X100 Pro', price: 89999, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', description: 'Advanced portrait camera phone', category: 'smartphone' },
  { id: '16', name: 'Oppo Find X6 Pro', price: 94999, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505', description: 'Premium flagship Android phone', category: 'smartphone' },
  { id: '17', name: 'Realme GT 5 Pro', price: 54999, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', description: 'Performance-focused flagship phone', category: 'smartphone' },
  { id: '18', name: 'Motorola Edge 40', price: 34999, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', description: 'Slim curved display smartphone', category: 'smartphone' },
  { id: '19', name: 'Asus ROG Phone 8', price: 99999, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505', description: 'Ultimate gaming smartphone', category: 'smartphone' },
  { id: '20', name: 'iQOO 12', price: 52999, image: 'https://images.unsplash.com/photo-1603899122634-3d9f7b1d04c6', description: 'Snapdragon powered performance phone', category: 'smartphone' },
  { id: '21', name: 'Redmi Note 13 Pro+', price: 31999, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505', description: 'Budget phone with 200MP camera', category: 'smartphone' },
  { id: '22', name: 'Samsung Galaxy A54', price: 38999, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', description: 'Mid-range Samsung smartphone', category: 'smartphone' },
  { id: '23', name: 'iPhone SE (3rd Gen)', price: 49999, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35c4', description: 'Compact and powerful iPhone', category: 'smartphone' },
  { id: '24', name: 'Honor Magic 6 Pro', price: 87999, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505', description: 'Premium flagship with advanced camera', category: 'smartphone' },

  // ===== Laptops =====
  { id: '25', name: 'MacBook Pro M3', price: 199999, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', description: 'Powerful laptop for professionals', category: 'laptop' },
  { id: '26', name: 'Dell XPS 15', price: 179999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', description: 'Premium ultrabook with stunning display', category: 'laptop' },
  { id: '27', name: 'HP Pavilion Gaming', price: 74999, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', description: 'Gaming laptop with RTX graphics', category: 'laptop' },
  { id: '28', name: 'ASUS ROG Strix G16', price: 159999, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', description: 'High-performance gaming laptop', category: 'laptop' },
  { id: '29', name: 'Lenovo ThinkPad X1 Carbon', price: 169999, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', description: 'Business ultrabook laptop', category: 'laptop' },

  // ===== Tablets =====
  { id: '30', name: 'iPad Pro', price: 99999, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', description: 'Powerful tablet device', category: 'tablet' },
  { id: '31', name: 'Samsung Galaxy Tab S9', price: 84999, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', description: 'Premium Android tablet', category: 'tablet' },
  { id: '32', name: 'Microsoft Surface Pro 9', price: 119999, image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41e5', description: '2-in-1 productivity tablet', category: 'tablet' },

  // ===== Smartwatches =====
  { id: '33', name: 'Apple Watch Series 9', price: 45999, image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b', description: 'Advanced smart watch', category: 'smartwatch' },
  { id: '34', name: 'Samsung Galaxy Watch 6', price: 32999, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a', description: 'Feature-packed smartwatch', category: 'smartwatch' },
  { id: '35', name: 'Garmin Forerunner 965', price: 59999, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1', description: 'Premium fitness smartwatch', category: 'smartwatch' },

  // ===== Headphones & Audio =====
  { id: '36', name: 'Sony WH-1000XM5', price: 29999, image: 'https://images.unsplash.com/photo-1518444028785-8f5b4c3d6e90', description: 'Noise cancelling headphones', category: 'audio' },
  { id: '37', name: 'Bose QuietComfort Ultra', price: 32999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', description: 'Premium ANC headphones', category: 'audio' },
  { id: '38', name: 'AirPods Pro 2', price: 24999, image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5', description: 'Wireless earbuds with ANC', category: 'audio' },
  { id: '39', name: 'JBL Flip 6', price: 11999, image: 'https://images.unsplash.com/photo-1585386959984-a41552231658', description: 'Portable Bluetooth speaker', category: 'audio' },

  // ===== Gaming =====
  { id: '40', name: 'PlayStation 5', price: 54999, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', description: 'Next-gen gaming console', category: 'gaming' },
  { id: '41', name: 'Xbox Series X', price: 52999, image: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d5', description: 'Powerful gaming console', category: 'gaming' },
  { id: '42', name: 'Nintendo Switch OLED', price: 34999, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e', description: 'Hybrid gaming console', category: 'gaming' },
  { id: '43', name: 'Logitech G Pro X Keyboard', price: 14999, image: 'https://images.unsplash.com/photo-1613145993487-7b87e53a5f39', description: 'Mechanical gaming keyboard', category: 'gaming' },
  { id: '44', name: 'Razer DeathAdder V3', price: 6999, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7', description: 'Ergonomic gaming mouse', category: 'gaming' },

  // ===== Cameras =====
  { id: '45', name: 'Canon EOS R6', price: 189999, image: 'https://images.unsplash.com/photo-1519183071298-a2962be96f83', description: 'Professional mirrorless camera', category: 'camera' },
  { id: '46', name: 'Sony Alpha A7 IV', price: 209999, image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c', description: 'Full-frame mirrorless camera', category: 'camera' },
  { id: '47', name: 'GoPro HERO12', price: 39999, image: 'https://images.unsplash.com/photo-1508898578281-774ac4893a2f', description: 'High-performance action camera', category: 'camera' },

  // ===== TVs & Monitors =====
  { id: '48', name: 'Samsung 55" QLED TV', price: 84999, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6', description: '4K Ultra HD Smart TV', category: 'tv' },
  { id: '49', name: 'LG C3 OLED 65"', price: 149999, image: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a', description: 'Premium OLED television', category: 'tv' },
  { id: '50', name: 'Dell 27" 4K Monitor', price: 39999, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', description: 'Ultra HD professional monitor', category: 'tv' },

  // ===== Accessories =====
  { id: '51', name: 'Apple Magic Keyboard', price: 11999, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', description: 'Wireless keyboard', category: 'accessory' },
  { id: '52', name: 'Anker 20000mAh Power Bank', price: 4999, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', description: 'Fast charging power bank', category: 'accessory' },
  { id: '53', name: 'Samsung T7 SSD 1TB', price: 8999, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704', description: 'Portable external SSD', category: 'accessory' },
  { id: '54', name: 'WD 2TB External HDD', price: 6999, image: 'https://images.unsplash.com/photo-1587202372775-9897c9a60f9a', description: 'Portable hard drive', category: 'accessory' },

  // ===== Home Appliances =====
  { id: '55', name: 'Dyson V15 Vacuum', price: 58999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952', description: 'Cordless vacuum cleaner', category: 'home' },
  { id: '56', name: 'Philips Air Fryer XL', price: 14999, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d', description: 'Healthy cooking air fryer', category: 'home' },
  { id: '57', name: 'Instant Pot Duo 7-in-1', price: 9999, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c', description: 'Multi-use pressure cooker', category: 'home' },

  // ===== Networking =====
  { id: '58', name: 'TP-Link WiFi 6 Router', price: 7999, image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2', description: 'High-speed WiFi router', category: 'networking' },
  { id: '59', name: 'Netgear Nighthawk AX12', price: 24999, image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2', description: 'Premium gaming router', category: 'networking' },

  // ===== Smart Home =====
  { id: '60', name: 'Amazon Echo Dot 5', price: 5499, image: 'https://images.unsplash.com/photo-1512446733611-9099a758e3a6', description: 'Smart speaker with Alexa', category: 'smart-home' },
  { id: '61', name: 'Google Nest Hub 2', price: 8999, image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b', description: 'Smart display assistant', category: 'smart-home' },
  { id: '62', name: 'Ring Video Doorbell 4', price: 13999, image: 'https://images.unsplash.com/photo-1583225276509-4a8b4c1c1ff0', description: 'Smart security doorbell', category: 'smart-home' },

  // ===== Extra Tech =====
  { id: '63', name: 'Fitbit Charge 6', price: 14999, image: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558', description: 'Advanced fitness tracker', category: 'extra-tech' },
  { id: '64', name: 'Kindle Paperwhite', price: 13999, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', description: 'E-reader with backlight', category: 'extra-tech' },
  { id: '65', name: 'DJI Mini 3 Drone', price: 59999, image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321', description: 'Compact 4K drone', category: 'extra-tech' },
  { id: '66', name: 'Corsair 32GB RAM Kit', price: 11999, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186', description: 'High-speed DDR5 RAM', category: 'extra-tech' },
  { id: '67', name: 'NVIDIA RTX 4070 GPU', price: 69999, image: 'https://images.unsplash.com/photo-1591799265444-d66432b91588', description: 'High-performance graphics card', category: 'extra-tech' },
  { id: '68', name: 'Apple AirTag (4 Pack)', price: 10999, image: 'https://images.unsplash.com/photo-1624996752380-8ec242e0f85d', description: 'Item tracking device', category: 'extra-tech' },
  { id: '69', name: 'Samsung 980 Pro 1TB NVMe', price: 12999, image: 'https://images.unsplash.com/photo-1628141180120-6d6a5a08d2e8', description: 'High-speed NVMe SSD', category: 'extra-tech' },

  // ===== Additional Electronics =====
  { id: '70', name: 'Logitech MX Master 3 Mouse', price: 8999, image: 'https://images.unsplash.com/photo-1616628189347-1c92f489b47d', description: 'Ergonomic wireless mouse', category: 'accessory' },
];

// ================= FINAL PRODUCTS =================
export const PRODUCTS: Product[] = BASE_PRODUCTS.map(product => ({
  ...product,
  variants: getVariantsByCategory(product.category),
  reviews: SAMPLE_REVIEWS.map((review, index) => ({
    ...review,
    id: `${product.id}-r${index + 1}`,
  })),
}));

// ================= HELPER =================
export const getAverageRating = (reviews: Review[]) => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
};
