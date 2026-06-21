package com.mahel.FoodOrderingService.config;

import com.mahel.FoodOrderingService.enums.UserRole;
import com.mahel.FoodOrderingService.model.*;
import com.mahel.FoodOrderingService.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private FoodRepository foodRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@foody.com") != null) return;

        User admin = new User();
        admin.setFullName("Foody Admin");
        admin.setEmail("admin@foody.com");
        // Set ADMIN_SEED_PASSWORD env var in production; fallback is for local dev only
        String seedPassword = System.getenv("ADMIN_SEED_PASSWORD");
        if (seedPassword == null || seedPassword.isBlank()) {
            seedPassword = "ChangeMe@123!";
        }
        admin.setPassword(passwordEncoder.encode(seedPassword));
        admin.setRole(UserRole.ROLE_RESTAURANT_OWNER);
        userRepository.save(admin);

        seedIndianKitchen(admin);
        seedBurgerHouse(admin);
        seedPizzaPalace(admin);
        seedChineseDragon(admin);
        seedSouthIndianCafe(admin);
        seedDessertLounge(admin);
    }

    // ---- 1. THE GREAT INDIAN KITCHEN ------------------------------------------
    private void seedIndianKitchen(User owner) {
        Restaurant r = makeRestaurant(owner,
            "The Great Indian Kitchen",
            "Authentic North Indian cuisine - rich gravies, tandoor delights, and royal biryanis.",
            "North Indian", "10:00 AM - 11:00 PM",
            "12 Spice Lane", "Mumbai", "Maharashtra", "400001",
            Arrays.asList(
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
            ));
        Category starters  = cat(r, "Starters");
        Category mainCourse= cat(r, "Main Course");
        Category breads    = cat(r, "Breads & Rice");
        Category desserts  = cat(r, "Desserts");
        // VEG
        food(r, starters,  "Paneer Tikka",          "Soft paneer cubes marinated in spiced yogurt and grilled in a tandoor till smoky.",             280L, true,  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80");
        food(r, starters,  "Veg Seekh Kebab",       "Minced mixed vegetables and spices shaped on skewers and cooked over charcoal.",               220L, true,  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Paneer Butter Masala",  "Velvety tomato-cashew gravy with golden paneer cubes - the crown jewel of Indian veg cuisine.", 350L, true,  "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Dal Makhani",           "Slow-cooked black lentils simmered overnight with butter and cream - a Punjabi classic.",       280L, true,  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Palak Paneer",          "Fresh cottage cheese in a vibrant spinach gravy spiced with ginger and cumin.",                 320L, true,  "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Chana Masala",          "Hearty chickpeas slow-cooked in a tangy spiced tomato gravy with dried mango powder.",          260L, true,  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80");
        food(r, breads,    "Butter Naan",           "Soft leavened flatbread baked in tandoor, finished with a generous brush of butter.",            60L, true,  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80");
        food(r, breads,    "Veg Biryani",           "Aromatic basmati rice cooked dum-style with seasonal vegetables and whole spices.",             320L, true,  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80");
        food(r, desserts,  "Gulab Jamun",           "Golden milk-solid dumplings soaked in rose-cardamom sugar syrup, served warm.",                 150L, true,  "https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&w=800&q=80");
        food(r, desserts,  "Rasmalai",              "Soft cottage cheese patties soaked in chilled saffron-cardamom milk.",                          180L, true,  "https://images.unsplash.com/photo-1630343710506-89f8b9f21d31?auto=format&fit=crop&w=800&q=80");
        // NON-VEG
        food(r, starters,  "Chicken Tikka",         "Boneless chicken marinated in spiced yogurt and flame-grilled to juicy perfection.",            320L, false, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80");
        food(r, starters,  "Mutton Seekh Kebab",    "Minced mutton mixed with herbs, green chillies, and spices, grilled on skewers.",              380L, false, "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Chicken Biryani",       "Slow-cooked basmati rice layered with marinated chicken, fried onions, and aromatic spices.",  450L, false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Butter Chicken",        "Tender chicken in a silky tomato-butter-cream sauce - the dish that conquered the world.",      420L, false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Mutton Rogan Josh",     "Slow-braised Kashmiri lamb in an aromatic sauce of whole spices and dried red chillies.",       520L, false, "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=800&q=80");
        food(r, mainCourse,"Prawn Masala",          "Juicy prawns cooked in a bold onion-tomato masala with coastal spices.",                        480L, false, "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=800&q=80");
    }

    // ---- 2. BURGER HOUSE -------------------------------------------------------
    private void seedBurgerHouse(User owner) {
        Restaurant r = makeRestaurant(owner,
            "Burger House",
            "Gourmet burgers crafted with fresh ingredients, secret sauces, and toasted brioche buns.",
            "American", "11:00 AM - 12:00 AM",
            "42 Street Food Market", "Delhi", "Delhi", "110001",
            Arrays.asList(
                "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
            ));
        Category burgers  = cat(r, "Burgers");
        Category sides    = cat(r, "Sides & Fries");
        Category drinks   = cat(r, "Beverages");
        Category desserts = cat(r, "Desserts");
        // VEG
        food(r, burgers,  "Crispy Veggie Burger",   "Crispy vegetable patty with lettuce, tomato, cucumber, and chipotle mayo in a toasted bun.",    199L, true,  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80");
        food(r, burgers,  "Paneer Crunch Burger",   "Spiced paneer patty with crunchy slaw, jalapenos, and house sauce.",                            229L, true,  "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80");
        food(r, burgers,  "Mushroom Swiss Melt",    "Sauteed mushrooms and melted Swiss cheese on a crispy hashbrown patty with garlic aioli.",      249L, true,  "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80");
        food(r, sides,    "Classic French Fries",   "Golden crispy fries seasoned with sea salt and served with ketchup.",                            99L, true,  "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80");
        food(r, sides,    "Peri Peri Fries",        "Tossed in our signature spicy peri peri masala - addictive and fiery.",                         119L, true,  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80");
        food(r, sides,    "Loaded Nachos",          "Tortilla chips topped with cheese sauce, jalapenos, salsa, and sour cream.",                    179L, true,  "https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=800&q=80");
        food(r, drinks,   "Chocolate Milkshake",    "Thick and creamy chocolate shake topped with whipped cream and a cherry.",                      149L, true,  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80");
        food(r, desserts, "Oreo Cheesecake",        "Smooth baked cheesecake on a crushed Oreo base, drizzled with chocolate sauce.",                189L, true,  "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80");
        // NON-VEG
        food(r, burgers,  "Classic Smash Burger",   "Double smashed beef patty, American cheese, pickles, and special sauce in a brioche bun.",     299L, false, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80");
        food(r, burgers,  "Spicy Chicken Burger",   "Crispy fried chicken with spicy sriracha mayo, pickled onions, and crunchy lettuce.",           249L, false, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80");
        food(r, burgers,  "BBQ Bacon Burger",       "Juicy beef patty topped with crispy bacon, BBQ sauce, caramelized onions, and cheddar.",        349L, false, "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80");
        food(r, burgers,  "Fish Fillet Burger",     "Crispy beer-battered fish fillet with tartar sauce, shredded cabbage, and lemon zest.",         269L, false, "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80");
        food(r, sides,    "Chicken Wings (6 pcs)",  "Crispy wings tossed in buffalo, BBQ, or honey garlic sauce.",                                   279L, false, "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80");
    }

    // ---- 3. PIZZA PALACE -------------------------------------------------------
    private void seedPizzaPalace(User owner) {
        Restaurant r = makeRestaurant(owner,
            "Pizza Palace",
            "Wood-fired Neapolitan pizzas made with San Marzano tomatoes, fresh mozzarella, and hand-stretched dough.",
            "Italian", "12:00 PM - 11:30 PM",
            "7 Napoli Square", "Bengaluru", "Karnataka", "560001",
            Arrays.asList(
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
            ));
        Category starters = cat(r, "Starters");
        Category pizza    = cat(r, "Pizzas");
        Category pasta    = cat(r, "Pasta");
        Category desserts = cat(r, "Desserts");
        // VEG
        food(r, starters, "Garlic Breadsticks",     "Crispy breadsticks with garlic butter and herbs, served with marinara dip.",                    149L, true,  "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80");
        food(r, starters, "Bruschetta",             "Toasted sourdough topped with fresh tomatoes, basil, garlic, and extra virgin olive oil.",       169L, true,  "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80");
        food(r, pizza,    "Margherita",             "Classic tomato sauce, buffalo mozzarella, and fresh basil on a thin crispy wood-fired base.",    349L, true,  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80");
        food(r, pizza,    "Farm Fresh Veggie",      "Bell peppers, mushrooms, olives, sun-dried tomatoes, and onions on herb tomato sauce.",          399L, true,  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80");
        food(r, pizza,    "Pesto Paneer Pizza",     "Homemade basil pesto, spiced paneer crumbles, red onions, and cherry tomatoes.",                 419L, true,  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80");
        food(r, pasta,    "Penne Arrabbiata",       "Spicy tomato sauce with garlic and red chillies tossed with al-dente penne.",                    299L, true,  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80");
        food(r, pasta,    "Creamy Mushroom Fettuccine","Fettuccine in a rich cream sauce with wild mushrooms, parmesan, and fresh thyme.",            329L, true,  "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80");
        food(r, desserts, "Tiramisu",               "Classic Italian dessert - espresso-soaked ladyfingers layered with mascarpone cream.",           229L, true,  "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80");
        food(r, desserts, "Panna Cotta",            "Silky vanilla cream dessert topped with fresh berry coulis.",                                    199L, true,  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80");
        // NON-VEG
        food(r, starters, "Chicken Wings Platter",  "Crispy wings in smoky BBQ glaze served with ranch dipping sauce.",                              299L, false, "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80");
        food(r, pizza,    "Pepperoni Feast",        "Double pepperoni, mozzarella, and fresh oregano on San Marzano tomato sauce.",                   449L, false, "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80");
        food(r, pizza,    "BBQ Chicken Pizza",      "Grilled chicken, caramelized onions, and smoky BBQ sauce topped with mozzarella.",              469L, false, "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80");
        food(r, pizza,    "Meat Lovers Supreme",    "Pepperoni, chicken, bacon, and Italian sausage on a rich tomato base.",                         529L, false, "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80");
        food(r, pasta,    "Chicken Bolognese",      "Rich slow-cooked minced chicken ragu tossed with spaghetti and parmesan.",                      349L, false, "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=800&q=80");
        food(r, pasta,    "Prawn Aglio e Olio",     "Spaghetti with tiger prawns, garlic chips, chilli flakes, and extra virgin olive oil.",         389L, false, "https://images.unsplash.com/photo-1473093226555-0b9a39dcec39?auto=format&fit=crop&w=800&q=80");
    }

    // ---- 4. CHINESE DRAGON -----------------------------------------------------
    private void seedChineseDragon(User owner) {
        Restaurant r = makeRestaurant(owner,
            "Chinese Dragon",
            "Indo-Chinese street food and authentic Oriental dishes - wok-tossed with bold flavours.",
            "Chinese", "11:30 AM - 10:30 PM",
            "88 Dragon Street", "Hyderabad", "Telangana", "500001",
            Arrays.asList(
                "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80"
            ));
        Category dimsums  = cat(r, "Dimsums & Starters");
        Category rice     = cat(r, "Rice & Noodles");
        Category mains    = cat(r, "Main Course");
        Category desserts = cat(r, "Desserts");
        // VEG
        food(r, dimsums,  "Veg Steamed Momos (8 pcs)","Delicate dumplings stuffed with seasoned cabbage, carrots, and herbs.",                       199L, true,  "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80");
        food(r, dimsums,  "Crispy Corn",              "Sweet corn coated in a light batter and fried golden, tossed with spicy chilli sauce.",        179L, true,  "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=80");
        food(r, dimsums,  "Spring Rolls (4 pcs)",     "Crispy rolls stuffed with stir-fried vegetables and glass noodles.",                           169L, true,  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80");
        food(r, rice,     "Veg Fried Rice",           "Wok-tossed basmati rice with fresh vegetables and a hint of soy and sesame.",                  229L, true,  "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80");
        food(r, rice,     "Hakka Noodles (Veg)",      "Classic Hakka-style stir-fried noodles with bell peppers, cabbage, and spring onions.",        219L, true,  "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80");
        food(r, mains,    "Veg Manchurian Gravy",     "Crispy vegetable dumplings in a tangy, spicy Manchurian sauce.",                               259L, true,  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80");
        food(r, mains,    "Tofu in Black Bean Sauce", "Silken tofu with mushrooms and bell peppers in a rich black bean garlic sauce.",                279L, true,  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80");
        food(r, desserts, "Date Pancake",             "Light Chinese-style crepe filled with caramelized dates and crushed walnuts.",                  149L, true,  "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80");
        // NON-VEG
        food(r, dimsums,  "Chicken Dimsums (8 pcs)",  "Juicy chicken and spring onion dumplings steamed to perfection.",                              249L, false, "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80");
        food(r, dimsums,  "Prawn Toast",              "Tiger prawns blended with ginger and sesame on crispy bread, fried golden.",                   289L, false, "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=800&q=80");
        food(r, rice,     "Chicken Fried Rice",       "Wok-tossed rice with tender chicken strips, eggs, and seasonal vegetables.",                   269L, false, "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80");
        food(r, rice,     "Prawn Noodles",            "Stir-fried egg noodles with tiger prawns, garlic, chilli, and Thai basil.",                   319L, false, "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80");
        food(r, mains,    "Chicken Manchurian",       "Crispy chicken in a bold, tangy Manchurian sauce with garlic and chilli.",                     299L, false, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80");
        food(r, mains,    "Kung Pao Chicken",         "Diced chicken stir-fried with peanuts, dried chillies, and Szechuan pepper.",                 309L, false, "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80");
        food(r, mains,    "Szechuan Fish",            "Crispy battered fish fillets tossed in fiery Szechuan chilli sauce.",                          339L, false, "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80");
    }

    // ---- 5. SOUTH INDIAN CAFE --------------------------------------------------
    private void seedSouthIndianCafe(User owner) {
        Restaurant r = makeRestaurant(owner,
            "South Indian Cafe",
            "Crispy dosas, fluffy idlis, aromatic sambar - authentic South Indian comfort food.",
            "South Indian", "7:00 AM - 10:00 PM",
            "14 Madras Street", "Chennai", "Tamil Nadu", "600001",
            Arrays.asList(
                "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1630343710506-89f8b9f21d31?auto=format&fit=crop&w=800&q=80"
            ));
        Category breakfast = cat(r, "Breakfast");
        Category dosas     = cat(r, "Dosas");
        Category rice      = cat(r, "Rice & Curry");
        Category desserts  = cat(r, "Desserts");
        // VEG
        food(r, breakfast, "Idli Sambar (4 pcs)",   "Soft steamed rice cakes served with piping hot sambar and coconut chutney.",                    120L, true,  "https://images.unsplash.com/photo-1630409351217-bc4fa6422075?auto=format&fit=crop&w=800&q=80");
        food(r, breakfast, "Medu Vada (2 pcs)",     "Crispy, golden lentil fritters with a fluffy interior, served with sambar and chutney.",        100L, true,  "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80");
        food(r, breakfast, "Rava Upma",             "Semolina tempered with mustard seeds, curry leaves, onions, served with coconut chutney.",      110L, true,  "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80");
        food(r, dosas,     "Plain Dosa",            "Thin, crispy fermented rice-lentil crepe served with coconut chutney and sambar.",              130L, true,  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80");
        food(r, dosas,     "Masala Dosa",           "Crispy golden dosa filled with spiced potato masala - South India's most iconic dish.",         160L, true,  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80");
        food(r, dosas,     "Onion Rava Dosa",       "Crispy semolina dosa studded with onions, green chillies, and coriander.",                      170L, true,  "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80");
        food(r, dosas,     "Set Dosa (3 pcs)",      "Soft, spongy thick dosas served with vegetable kurma and coconut chutney.",                     150L, true,  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80");
        food(r, rice,      "Sambar Rice",           "Hot steamed rice mixed with tangy, spiced sambar and a drizzle of ghee.",                        140L, true,  "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=800&q=80");
        food(r, rice,      "Curd Rice",             "Comfort rice mixed with fresh yogurt, tempered with mustard and curry leaves.",                  120L, true,  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80");
        food(r, rice,      "Bisi Bele Bath",        "Karnataka signature dish - rice, lentils, and vegetables with aromatic spice powder and ghee.", 180L, true,  "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=800&q=80");
        food(r, desserts,  "Payasam",               "Creamy vermicelli pudding with milk, cardamom, raisins, and cashews.",                           130L, true,  "https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&w=800&q=80");
        // NON-VEG
        food(r, dosas,     "Chicken Keema Dosa",    "Crispy dosa stuffed with spiced minced chicken and onions.",                                     240L, false, "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80");
        food(r, rice,      "Chettinad Chicken Curry","Fiery aromatic Chettinad-style chicken curry loaded with pepper and whole spices.",             320L, false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80");
        food(r, rice,      "Fish Curry & Rice",     "Tangy tamarind-based fish curry served with steamed rice and papad.",                            340L, false, "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=800&q=80");
        food(r, rice,      "Prawn Biryani",         "Fragrant basmati rice cooked with juicy prawns, curry leaves, and coastal spices.",              420L, false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80");
    }

    // ---- 6. THE DESSERT LOUNGE -------------------------------------------------
    private void seedDessertLounge(User owner) {
        Restaurant r = makeRestaurant(owner,
            "The Dessert Lounge",
            "Artisan desserts, specialty cakes, waffles, and indulgent beverages in a cosy cafe setting.",
            "Desserts & Cafe", "10:00 AM - 11:00 PM",
            "5 Sweet Boulevard", "Pune", "Maharashtra", "411001",
            Arrays.asList(
                "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80"
            ));
        Category cakes    = cat(r, "Cakes & Pastries");
        Category waffles  = cat(r, "Waffles & Crepes");
        Category iceCream = cat(r, "Ice Cream");
        Category drinks   = cat(r, "Hot Beverages");
        Category bites    = cat(r, "Savoury Bites");
        // VEG
        food(r, cakes,    "Chocolate Truffle Cake", "Dense, rich chocolate cake layered with velvety truffle cream and cocoa glaze.",                 249L, true,  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80");
        food(r, cakes,    "Red Velvet Slice",       "Moist red velvet cake with tangy cream cheese frosting and red velvet crumbs.",                  219L, true,  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80");
        food(r, cakes,    "Belgian Choco Brownie",  "Fudgy warm brownie with a gooey center, served with vanilla ice cream and caramel drizzle.",     189L, true,  "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80");
        food(r, waffles,  "Classic Butter Waffle",  "Crispy golden waffle with whipped cream, fresh berries, and maple syrup.",                       199L, true,  "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80");
        food(r, waffles,  "Nutella Banana Crepe",   "Thin crepe stuffed with Nutella, sliced banana, and crushed hazelnuts.",                         179L, true,  "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80");
        food(r, iceCream, "Belgian Choc Sundae",    "Three scoops of premium chocolate ice cream with hot fudge, almonds, and a cherry.",             199L, true,  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80");
        food(r, iceCream, "Mango Sorbet",           "Refreshing homemade sorbet made from Alphonso mangoes - dairy-free and delightful.",             149L, true,  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80");
        food(r, drinks,   "Espresso",               "Double shot of our signature dark-roast espresso - bold, smooth, and aromatic.",                  99L, true,  "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80");
        food(r, drinks,   "Masala Chai Latte",      "Warm spiced chai with ginger, cardamom, cinnamon, and steamed milk.",                            129L, true,  "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80");
        food(r, bites,    "Avocado Toast",          "Sourdough topped with smashed avocado, cherry tomatoes, chilli flakes, and micro greens.",        229L, true,  "https://images.unsplash.com/photo-1603046891744-1f0a72ae7bf0?auto=format&fit=crop&w=800&q=80");
        // NON-VEG
        food(r, bites,    "Chicken Quesadilla",     "Grilled chicken with cheddar, jalapenos, and roasted peppers in a crispy flour tortilla.",        279L, false, "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=80");
        food(r, bites,    "Smoked Chicken Sandwich","Pulled smoked chicken with coleslaw, pickles, and chipotle mayo on toasted brioche.",             299L, false, "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=800&q=80");
        food(r, bites,    "BLT Club Sandwich",      "Triple-decker with crispy bacon, lettuce, tomato, and house mayo on white bread.",                289L, false, "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80");
    }

    // ---- HELPERS ---------------------------------------------------------------
    private Restaurant makeRestaurant(User owner, String name, String desc, String cuisine,
            String hours, String street, String city, String state, String postal, List<String> images) {
        Address addr = new Address();
        addr.setStreet(street); addr.setCity(city); addr.setState(state);
        addr.setCountry("India"); addr.setPostalCode(postal);

        ContactInformation contact = new ContactInformation();
        contact.setEmail(name.toLowerCase().replaceAll("[^a-z0-9]", "") + "@foody.com");
        contact.setMobile("98765" + String.valueOf(Math.abs(name.hashCode() % 90000 + 10000)));

        Restaurant r = new Restaurant();
        r.setName(name); r.setDescription(desc); r.setCuisineType(cuisine);
        r.setOpeningHours(hours); r.setRegistrationDate(LocalDateTime.now());
        r.setOwner(owner); r.setOpen(true);
        r.setAddress(addr); r.setContactInformation(contact); r.setImages(images);
        return restaurantRepository.save(r);
    }

    private Category cat(Restaurant r, String name) {
        Category c = new Category();
        c.setName(name); c.setRestaurant(r);
        return categoryRepository.save(c);
    }

    private void food(Restaurant r, Category cat, String name, String desc, long price,
            boolean veg, String img) {
        Food f = new Food();
        f.setName(name); f.setDescription(desc); f.setPrice(price);
        f.setFoodCategory(cat); f.setRestaurant(r);
        f.setVegetarian(veg); f.setSeasonal(false); f.setAvailable(true);
        f.setCreationDate(new Date());
        f.setImages(Collections.singletonList(img));
        foodRepository.save(f);
    }
}
