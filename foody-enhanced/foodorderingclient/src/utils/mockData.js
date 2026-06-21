// ============================================================
// MOCK DATA — used for demo when backend is not running
// To add a new restaurant for evaluator: copy one of the objects
// below, change id/name/cuisineType/address/images fields, and paste it.
// ============================================================

export const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "Spice Garden",
    description: "Authentic North Indian flavours made with fresh spices",
    cuisineType: "North Indian • Biryani • Tandoor",
    open: true,
    images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80"],
    address: { street: "12 MG Road", city: "Bengaluru", state: "Karnataka", pinCode: "560001" },
    contactInformation: { email: "spice@foody.in", mobile: "9876500001", twitter: "@SpiceGarden", instagram: "@spicegarden_blr" },
    openingHours: "10AM – 11PM",
    registrationId: "FSSAI-BLR-001",
  },
  {
    id: 2,
    name: "Pizza Paradiso",
    description: "Wood-fired Italian pizzas with imported cheese and fresh basil",
    cuisineType: "Italian • Pizza • Pasta",
    open: true,
    images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"],
    address: { street: "45 Indiranagar 100ft Rd", city: "Bengaluru", state: "Karnataka", pinCode: "560038" },
    contactInformation: { email: "pizza@foody.in", mobile: "9876500002", twitter: "@PizzaParadiso", instagram: "@pizzaparadiso_blr" },
    openingHours: "11AM – 11PM",
    registrationId: "FSSAI-BLR-002",
  },
  {
    id: 3,
    name: "Dragon Wok",
    description: "Best Chinese & pan-Asian street food in town",
    cuisineType: "Chinese • Thai • Asian",
    open: true,
    images: ["https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80"],
    address: { street: "78 Koramangala 5th Block", city: "Bengaluru", state: "Karnataka", pinCode: "560095" },
    contactInformation: { email: "dragon@foody.in", mobile: "9876500003", twitter: "@DragonWok", instagram: "@dragonwok_blr" },
    openingHours: "12PM – 11PM",
    registrationId: "FSSAI-BLR-003",
  },
  {
    id: 4,
    name: "Burger Junction",
    description: "Juicy gourmet burgers, crispy fries and thick shakes",
    cuisineType: "American • Burgers • Fast Food",
    open: true,
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"],
    address: { street: "22 Brigade Road", city: "Bengaluru", state: "Karnataka", pinCode: "560025" },
    contactInformation: { email: "burger@foody.in", mobile: "9876500004", twitter: "@BurgerJunction", instagram: "@burgerjunction_blr" },
    openingHours: "10AM – 12AM",
    registrationId: "FSSAI-BLR-004",
  },
  {
    id: 5,
    name: "Dosa Darbar",
    description: "Traditional South Indian breakfast and tiffin served all day",
    cuisineType: "South Indian • Dosa • Idli",
    open: true,
    images: ["https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"],
    address: { street: "9 Jayanagar 4th Block", city: "Bengaluru", state: "Karnataka", pinCode: "560041" },
    contactInformation: { email: "dosa@foody.in", mobile: "9876500005", twitter: "@DosaDarbar", instagram: "@dosadarbar_blr" },
    openingHours: "7AM – 10PM",
    registrationId: "FSSAI-BLR-005",
  },
  {
    id: 6,
    name: "Cake & Crumb",
    description: "Artisan cakes, pastries and desserts baked fresh every morning",
    cuisineType: "Desserts • Bakery • Café",
    open: true,
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"],
    address: { street: "3 Sadashivanagar", city: "Bengaluru", state: "Karnataka", pinCode: "560080" },
    contactInformation: { email: "cake@foody.in", mobile: "9876500006", twitter: "@CakeAndCrumb", instagram: "@cakeandcrumb_blr" },
    openingHours: "8AM – 10PM",
    registrationId: "FSSAI-BLR-006",
  },
  {
    id: 7,
    name: "Biryani Bros",
    description: "Dum biryani cooked the old-school way — slow, smoky and flavourful",
    cuisineType: "Biryani • Mughlai • Kebabs",
    open: true,
    images: ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"],
    address: { street: "56 Whitefield Main Rd", city: "Bengaluru", state: "Karnataka", pinCode: "560066" },
    contactInformation: { email: "biryani@foody.in", mobile: "9876500007", twitter: "@BiryaniBros", instagram: "@biryanibros_blr" },
    openingHours: "11AM – 11PM",
    registrationId: "FSSAI-BLR-007",
  },
  {
    id: 8,
    name: "The Coastal Kitchen",
    description: "Fresh seafood curries, prawn fry and Mangalorean specials",
    cuisineType: "Seafood • Mangalorean • Kerala",
    open: false,
    images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80"],
    address: { street: "18 HSR Layout Sector 6", city: "Bengaluru", state: "Karnataka", pinCode: "560102" },
    contactInformation: { email: "coastal@foody.in", mobile: "9876500008", twitter: "@CoastalKitchen", instagram: "@coastalkitchen_blr" },
    openingHours: "12PM – 10PM",
    registrationId: "FSSAI-BLR-008",
  },
];

// Mock menu items per restaurant
const MENUS = {
  default: [
    { id: 101, name: "Veg Starter Platter", description: "Seasonal vegetables, dips and crispy papad", price: 249, vegetarian: true, images: ["https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80"], available: true, seasonal: false, ingredients: [] },
    { id: 102, name: "Paneer Tikka", description: "Smoky cottage cheese marinated in spiced yogurt", price: 299, vegetarian: true, images: ["https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?auto=format&fit=crop&w=400&q=80"], available: true, seasonal: false, ingredients: [] },
    { id: 103, name: "Chicken Curry", description: "Classic home-style chicken curry with fragrant rice", price: 349, vegetarian: false, images: ["https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80"], available: true, seasonal: false, ingredients: [] },
    { id: 104, name: "Dal Makhani", description: "Slow-cooked black lentils in rich buttery gravy", price: 229, vegetarian: true, images: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"], available: true, seasonal: false, ingredients: [] },
    { id: 105, name: "Garlic Naan", description: "Soft leavened bread baked in tandoor with garlic butter", price: 59, vegetarian: true, images: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"], available: true, seasonal: false, ingredients: [] },
    { id: 106, name: "Mango Lassi", description: "Chilled yogurt drink blended with fresh Alphonso mango", price: 89, vegetarian: true, images: ["https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=400&q=80"], available: true, seasonal: true, ingredients: [] },
  ],
};

export const getMockMenuForRestaurant = (restaurantId) => MENUS[restaurantId] || MENUS.default;

export const getMockCategories = () => [
  { id: 1, name: "Starters" },
  { id: 2, name: "Main Course" },
  { id: 3, name: "Breads" },
  { id: 4, name: "Beverages" },
];

// ─────────────────────────────────────────────
// ORDER HELPERS (localStorage-based, no backend)
// ─────────────────────────────────────────────
const ORDERS_KEY = 'foody_mock_orders';

export const saveMockOrder = (order) => {
  const all = getMockOrders();
  all.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
};

export const getMockOrders = () => {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch { return []; }
};

export const cancelMockOrder = (orderId) => {
  const all = getMockOrders().map(o => o.id === orderId ? { ...o, orderStatus: 'CANCELLED' } : o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  return all;
};

export const generateOrderId = () => Date.now();

// Mock admin data
export const MOCK_ADMIN_RESTAURANT = MOCK_RESTAURANTS[0]; // Spice Garden by default

export const MOCK_ADMIN_ORDERS = [
  { id: 1001, orderStatus: 'DELIVERED', createdAt: new Date(Date.now()-3600000*2).toISOString(), totalPrice: 647, customer: { userName: 'Rahul M', email: 'rahul@example.com' }, orderItems: [{ food: { name: 'Paneer Tikka' }, quantity: 2, totalPrice: 598 }, { food: { name: 'Garlic Naan' }, quantity: 1, totalPrice: 59 }], deliveryAddress: { streetAddress: '12 MG Road', city: 'Bengaluru' } },
  { id: 1002, orderStatus: 'PENDING',   createdAt: new Date(Date.now()-1800000).toISOString(),   totalPrice: 349, customer: { userName: 'Priya S', email: 'priya@example.com' },  orderItems: [{ food: { name: 'Chicken Curry' }, quantity: 1, totalPrice: 349 }],                                              deliveryAddress: { streetAddress: '45 Indiranagar', city: 'Bengaluru' } },
  { id: 1003, orderStatus: 'OUT_FOR_DELIVERY', createdAt: new Date(Date.now()-900000).toISOString(), totalPrice: 498, customer: { userName: 'Amit K', email: 'amit@example.com' }, orderItems: [{ food: { name: 'Dal Makhani' }, quantity: 2, totalPrice: 458 }, { food: { name: 'Mango Lassi' }, quantity: 1, totalPrice: 89 }], deliveryAddress: { streetAddress: '7 Koramangala', city: 'Bengaluru' } },
  { id: 1004, orderStatus: 'DELIVERED', createdAt: new Date(Date.now()-3600000*5).toISOString(), totalPrice: 826, customer: { userName: 'Sneha R', email: 'sneha@example.com' }, orderItems: [{ food: { name: 'Veg Starter Platter' }, quantity: 2, totalPrice: 498 }, { food: { name: 'Dal Makhani' }, quantity: 1, totalPrice: 229 }, { food: { name: 'Garlic Naan' }, quantity: 2, totalPrice: 118 }], deliveryAddress: { streetAddress: '3 Sadashivanagar', city: 'Bengaluru' } },
];
