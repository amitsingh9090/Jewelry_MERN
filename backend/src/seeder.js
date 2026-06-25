import prisma from './prisma.js';
import bcrypt from 'bcryptjs';

const INITIAL_PRODUCTS = [
  {
    id: "1",
    name: 'The Empress Emerald Necklace',
    category: 'Premium Jewelry',
    occasions: ['Reception Collection', 'Wedding Jewelry'],
    festivals: ['Diwali Sparkle'],
    culture: 'Victorian Elegance',
    dailyRent: 150,
    deposit: 1200,
    rating: 4.9,
    weight: '45g',
    size: 'Standard',
    material: '18k White Gold, Emeralds & Diamonds',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    description: 'A breathtaking statement piece featuring a 25-carat Zambian emerald surrounded by brilliant-cut diamonds, set in 18k white gold.'
  },
  {
    id: "3",
    name: 'Valkyrie Diamond Tiara',
    category: 'Premium Jewelry',
    occasions: ['Engagement Collection', 'Wedding Jewelry'],
    festivals: ['Eid Opulence'],
    culture: 'Victorian Elegance',
    dailyRent: 280,
    deposit: 2500,
    rating: 5.0,
    weight: '35g',
    size: 'Standard Fit',
    material: 'Platinum, F-VVS Diamonds',
    image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=600',
    description: 'An ethereal crown design showcasing marquise and pear-shaped solitaire diamonds, crafted for a majestic bridal entrance.'
  },
  {
    id: "7",
    name: 'Royal Solitaire Engagement Ring',
    category: 'Premium Jewelry',
    occasions: ['Engagement Collection'],
    festivals: ['Diwali Sparkle'],
    culture: '',
    dailyRent: 110,
    deposit: 1500,
    rating: 4.9,
    weight: '5g',
    size: '6, 7, 8 (US)',
    material: 'Platinum, 3ct Solitaire Diamond',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    description: 'A classic 6-prong platinum ring holding an exceptional, high-brilliance round solitaire diamond.'
  },
  {
    id: "8",
    name: 'Modern Art-Deco Diamond Set',
    category: 'Premium Jewelry',
    occasions: ['Reception Collection'],
    festivals: ['Eid Opulence'],
    culture: 'Victorian Elegance',
    dailyRent: 200,
    deposit: 1800,
    rating: 4.9,
    weight: '38g',
    size: 'Standard',
    material: '18k White Gold, Baguette & Round Diamonds',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    description: 'An elegant geometric diamond bib necklace with matching drop earrings, designed for modern high-fashion reception galas.'
  },
  {
    id: "13",
    name: 'Princess Cut Diamond Studs',
    category: 'Premium Jewelry',
    occasions: ['Engagement Collection', 'Reception Collection'],
    festivals: ['Diwali Sparkle'],
    culture: '',
    dailyRent: 75,
    deposit: 600,
    rating: 4.8,
    weight: '4g',
    size: 'One Size',
    material: '14k Yellow Gold, 1.5ct Princess Diamonds',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=600',
    description: 'Elegantly understated princess cut diamond earrings set in solid yellow gold, suitable for engagements and formal dinners.'
  },
  {
    id: "14",
    name: 'Platinum Chevron Reception Band',
    category: 'Premium Jewelry',
    occasions: ['Reception Collection'],
    festivals: ['Eid Opulence'],
    culture: '',
    dailyRent: 65,
    deposit: 500,
    rating: 4.7,
    weight: '6g',
    size: 'Adjustable',
    material: 'Platinum, Micro-Pavé Diamonds',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
    description: 'A contemporary chevron ring hand-studded with micro-pavé diamonds to stack or wear alone for evening events.'
  },
  {
    id: "2",
    name: 'Royal Kundan Choker Set',
    category: 'Traditional Jewelry',
    occasions: ['Mehndi Collection', 'Wedding Jewelry'],
    festivals: ['Diwali Sparkle'],
    culture: 'Rajputana Royalty',
    dailyRent: 95,
    deposit: 750,
    rating: 4.8,
    weight: '62g',
    size: 'Adjustable',
    material: '22k Gold Plated, Polki Diamonds, Pearls',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    description: 'Traditional heritage kundan choker embellished with pearls, polki diamonds, and delicate hand-painted meenakari backing.'
  },
  {
    id: "5",
    name: 'Ethereal Floral Haldi Set',
    category: 'Traditional Jewelry',
    occasions: ['Haldi Collection'],
    festivals: ['Navratri Heritage'],
    culture: '',
    dailyRent: 45,
    deposit: 300,
    rating: 4.6,
    weight: '18g',
    size: 'Flexible',
    material: 'Silver base with Yellow Enamel and Seed Pearls',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
    description: 'Bright and cheerful yellow-themed jewelry set designed specifically to complement Haldi ceremonial couture.'
  },
  {
    id: "11",
    name: 'Marigold Floral Haldi Choker',
    category: 'Traditional Jewelry',
    occasions: ['Haldi Collection'],
    festivals: ['Navratri Heritage'],
    culture: '',
    dailyRent: 40,
    deposit: 250,
    rating: 4.5,
    weight: '12g',
    size: 'Adjustable',
    material: 'Silk Base, Dried Marigold Petals, Pearls',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600',
    description: 'Handcrafted floral choker designed for traditional Haldi events, offering a fresh, natural aesthetic.'
  },
  {
    id: "16",
    name: 'Heritage Royal Bridal Nath',
    category: 'Traditional Jewelry',
    occasions: ['Wedding Jewelry'],
    festivals: ['Diwali Sparkle'],
    culture: '',
    dailyRent: 30,
    deposit: 200,
    rating: 4.8,
    weight: '8g',
    size: 'Standard',
    material: '22k Gold, Ruby, Seed Pearls',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    description: 'An elegant oversized bridal nose ring embellished with emerald drops, a ruby center, and delicate pearl strings.'
  },
  {
    id: "4",
    name: 'Temple Laxmi Gold Kasumala',
    category: 'Temple Jewelry',
    occasions: ['Wedding Jewelry'],
    festivals: ['Navratri Heritage'],
    culture: 'South Indian Divine',
    dailyRent: 120,
    deposit: 900,
    rating: 4.7,
    weight: '75g',
    size: 'Long String',
    material: '22k Antique Gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    description: 'Beautiful traditional coin necklace featuring embossed Goddess Laxmi motifs and intricate hand-carved borders.'
  },
  {
    id: "10",
    name: 'Gilded Peacock Temple Kada',
    category: 'Temple Jewelry',
    occasions: ['Wedding Jewelry'],
    festivals: ['Navratri Heritage'],
    culture: 'South Indian Divine',
    dailyRent: 55,
    deposit: 400,
    rating: 4.8,
    weight: '28g',
    size: '2.6, 2.8',
    material: '22k Antique Gold, Rubies',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
    description: 'Traditional solid temple bangle decorated with double peacock engravings and inlaid with cabochon rubies.'
  },
  {
    id: "15",
    name: 'Antique Nakashi Haram Necklace',
    category: 'Temple Jewelry',
    occasions: ['Wedding Jewelry'],
    festivals: ['Navratri Heritage'],
    culture: 'South Indian Divine',
    dailyRent: 140,
    deposit: 1100,
    rating: 4.9,
    weight: '95g',
    size: 'Long Haram',
    material: '22k Gold, Kemp Stones, Basra Pearls',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?auto=format&fit=crop&q=80&w=600',
    description: 'A heavy heritage Nakashi long necklace depicting divine wedding scenes, decorated with premium kemp stones and pearl drops.'
  },
  {
    id: "6",
    name: 'Mehndi Green Pearl Drop Jhumkas',
    category: 'Cultural Jewelry',
    occasions: ['Mehndi Collection'],
    festivals: ['Eid Opulence'],
    culture: 'Mughal Heritage',
    dailyRent: 35,
    deposit: 250,
    rating: 4.8,
    weight: '15g',
    size: 'Standard',
    material: '18k Yellow Gold, Basra Pearls, Green Onyx',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
    description: 'Dangling ethnic jhumkas featuring delicate mint-green gemstone drops and vintage filigree gold details.'
  },
  {
    id: "9",
    name: 'Grand Mughal Polki Necklace',
    category: 'Cultural Jewelry',
    occasions: ['Wedding Jewelry'],
    festivals: ['Diwali Sparkle'],
    culture: 'Mughal Heritage',
    dailyRent: 220,
    deposit: 2000,
    rating: 5.0,
    weight: '90g',
    size: 'Adjustable Dori',
    material: '24k Gold, Uncut Polki Diamonds, Ruby Beads',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600',
    description: 'Mughal-inspired collar set showcasing raw, uncut polki diamonds nested in a beautiful 24k gold setting with ruby beads.'
  },
  {
    id: "12",
    name: 'Chandbali Mehndi Danglers',
    category: 'Cultural Jewelry',
    occasions: ['Mehndi Collection'],
    festivals: ['Eid Opulence'],
    culture: 'Rajputana Royalty',
    dailyRent: 50,
    deposit: 350,
    rating: 4.7,
    weight: '22g',
    size: 'Medium Hang',
    material: '21k Gold, Pearl Bunches, Turquoise Inlay',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
    description: 'Elegantly shaped crescent moon earrings with pearl fringes, designed for Mehndi celebrations and festival nights.'
  },
  {
    id: "17",
    name: 'The Maharani Kundan Nath',
    category: 'Traditional Jewelry',
    occasions: ['Wedding Jewelry', 'Mehndi Collection'],
    festivals: ['Diwali Sparkle'],
    culture: 'Rajputana Royalty',
    dailyRent: 35,
    deposit: 250,
    rating: 4.8,
    weight: '8g',
    size: 'Adjustable',
    material: '22k Gold Plated, Uncut Polki, Pearl strands',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    description: 'A classic heritage-style nose ring showcasing fine kundan settings and triple-strand basra pearl hangers.'
  },
  {
    id: "18",
    name: 'Sunkissed Yellow Floral Haathphool',
    category: 'Traditional Jewelry',
    occasions: ['Haldi Collection'],
    festivals: ['Navratri Heritage'],
    culture: '',
    dailyRent: 25,
    deposit: 150,
    rating: 4.6,
    weight: '14g',
    size: 'One Size',
    material: 'Silk flowers, artificial pollens, pearl strands',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
    description: 'Stunning yellow floral bracelets with finger rings designed for modern auspicious Haldi styling.'
  },
  {
    id: "19",
    name: 'Royal Mughal Passa/Jhumar',
    category: 'Cultural Jewelry',
    occasions: ['Wedding Jewelry', 'Mehndi Collection'],
    festivals: ['Eid Opulence'],
    culture: 'Mughal Heritage',
    dailyRent: 45,
    deposit: 350,
    rating: 4.9,
    weight: '26g',
    size: 'Standard',
    material: 'Silver-gold alloy, Kemp Stones, Pearl Bunches',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600',
    description: 'Side head-pendant featuring intricate crescent-moon carvings and thick dangling pearl clusters.'
  },
  {
    id: "20",
    name: 'Solitaire Diamond Tennis Bracelet',
    category: 'Premium Jewelry',
    occasions: ['Reception Collection', 'Engagement Collection'],
    festivals: ['Diwali Sparkle'],
    culture: 'Victorian Elegance',
    dailyRent: 130,
    deposit: 1000,
    rating: 5.0,
    weight: '11g',
    size: '7 inches',
    material: '18k White Gold, F-VVS Solitaires',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    description: 'An elegant tennis bracelet featuring a continuous line of 5-carat round brilliant-cut solitaire diamonds set in white gold.'
  }
];

const INITIAL_USERS = [
  {
    email: 'aria@sterling.com',
    name: 'Aria Sterling',
    phone: '+1 (555) 902-8822',
    address: '742 Park Avenue, New York, NY 10021',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    hasAdminAccess: false
  },
  {
    email: 'amit@example.com',
    name: 'Amit Singh',
    phone: '+91 9999999999',
    address: 'New Delhi, India',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    hasAdminAccess: true
  }
];

const INITIAL_CMS = {
  categories: ['Premium Jewelry', 'Temple Jewelry', 'Cultural Jewelry', 'Traditional Jewelry'],
  festivals: ['Diwali Sparkle', 'Eid Opulence', 'Navratri Heritage'],
  cultures: ['Mughal Heritage', 'South Indian Divine', 'Rajputana Royalty', 'Victorian Elegance'],
  occasions: ['Wedding Jewelry', 'Haldi Collection', 'Mehndi Collection', 'Engagement Collection', 'Reception Collection']
};

export async function seedDatabase() {
  try {
    console.log("Checking if database needs seeding...");

    // 1. Seed Products
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      console.log("Seeding products...");
      await prisma.product.createMany({
        data: INITIAL_PRODUCTS
      });
      console.log(`${INITIAL_PRODUCTS.length} products seeded successfully.`);
    }

    // 2. Seed Users
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("Seeding users...");
      const saltedUsers = INITIAL_USERS.map(u => ({
        ...u,
        password: bcrypt.hashSync(u.password, 10)
      }));
      for (const u of saltedUsers) {
        await prisma.user.create({ data: u });
      }
      console.log(`${INITIAL_USERS.length} users seeded successfully.`);
    }

    // 3. Seed Admin Security Credentials settings
    const adminCount = await prisma.adminCredentials.count();
    if (adminCount === 0) {
      console.log("Seeding admin default credentials...");
      await prisma.adminCredentials.create({
        data: { username: "amit9115", password: "12345" }
      });
      console.log("Admin credentials record created.");
    }

    // 4. Seed CMS configurations
    const cmsCount = await prisma.cmsConfig.count();
    if (cmsCount === 0) {
      console.log("Seeding CMS configs...");
      await prisma.cmsConfig.create({
        data: INITIAL_CMS
      });
      console.log("CMS categories, occasions, cultures, and festivals seeded.");
    }

    console.log("Database verification check complete.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
