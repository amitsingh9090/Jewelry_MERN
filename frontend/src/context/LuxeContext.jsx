import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const LuxeContext = createContext();

const INITIAL_PRODUCTS = [
  // Premium Jewelry
  {
    id: 1,
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
    id: 3,
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
    id: 7,
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
    id: 8,
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
    id: 13,
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
    id: 14,
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

  // Traditional Jewelry
  {
    id: 2,
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
    id: 5,
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
    id: 11,
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
    id: 16,
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

  // Temple Jewelry
  {
    id: 4,
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
    id: 10,
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
    id: 15,
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

  // Cultural Jewelry
  {
    id: 6,
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
    id: 9,
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
    id: 12,
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
    id: 17,
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
    material: '22k Gold Plated, Uncut Polki, Pearl Strands',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    description: 'A classic heritage-style nose ring showcasing fine kundan settings and triple-strand basra pearl hangers.'
  },
  {
    id: 18,
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
    id: 19,
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
    id: 20,
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('luxe_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export function LuxeProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('luxe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [adminCredentials, setAdminCredentials] = useState({ username: 'amit9115', password: '12345' });
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([
    { id: 'TCK-102', subject: 'Custom Sizing Query', status: 'Closed', message: 'Resolved by support team' }
  ]);

  // CMS Configurations State
  const [categories, setCategories] = useState(['Premium Jewelry', 'Temple Jewelry', 'Cultural Jewelry', 'Traditional Jewelry']);
  const [festivals, setFestivals] = useState(['Diwali Sparkle', 'Eid Opulence', 'Navratri Heritage']);
  const [cultures, setCultures] = useState(['Mughal Heritage', 'South Indian Divine', 'Rajputana Royalty', 'Victorian Elegance']);
  const [occasions, setOccasions] = useState(['Wedding Jewelry', 'Haldi Collection', 'Mehndi Collection', 'Engagement Collection', 'Reception Collection']);

  const fetchUserData = async (token, loggedInUser) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      if (loggedInUser.hasAdminAccess) {
        const res = await fetch(`${API_URL}/orders`, { headers });
        const data = await res.json();
        if (res.ok) setOrders(data.orders);

        const resUsers = await fetch(`${API_URL}/auth/users`, { headers });
        const dataUsers = await resUsers.json();
        if (resUsers.ok) setUsers(dataUsers.users);
      } else {
        const res = await fetch(`${API_URL}/orders/my-orders`, { headers });
        const data = await res.json();
        if (res.ok) setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error loading user-specific data:", err);
    }
  };

  // Mount effects to load database records
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
        } else {
          setProducts(INITIAL_PRODUCTS); // Fallback
        }
      } catch (err) {
        console.error("Error loading catalog:", err);
        setProducts(INITIAL_PRODUCTS); // Fallback
      }
    };

    const loadCms = async () => {
      try {
        const res = await fetch(`${API_URL}/cms`);
        const data = await res.json();
        if (res.ok && data.config) {
          setCategories(data.config.categories);
          setFestivals(data.config.festivals);
          setCultures(data.config.cultures);
          setOccasions(data.config.occasions);
        }
      } catch (err) {
        console.error("Error loading CMS configurations:", err);
      }
    };

    const loadAdminCredentials = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/credentials`);
        const data = await res.json();
        if (res.ok) {
          setAdminCredentials({ username: data.username, password: data.password });
        }
      } catch (err) {
        console.error("Error loading admin configurations:", err);
      }
    };

    const loadProfile = async () => {
      const token = localStorage.getItem('luxe_token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user);
            fetchUserData(token, data.user);
          } else {
            localStorage.removeItem('luxe_token');
            setUser(null);
          }
        } catch (err) {
          console.error("Error loading profile session:", err);
          localStorage.removeItem('luxe_token');
          setUser(null);
        }
      }
    };

    // Initial load
    loadCatalog();
    loadCms();
    loadAdminCredentials();
    loadProfile();

    // Set up a 10-second polling interval for automatic sync
    const pollInterval = setInterval(() => {
      loadCatalog();
      loadCms();
      loadAdminCredentials();
      loadProfile();
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  // Cart/Wishlist localStorage Syncs (Remains local)
  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Product CRUD
  const addProduct = async (prod) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(prod)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(prev => [...prev, data.product]);
      toast.success(`${data.product.name} added to vault!`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error adding product.');
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.error('Item removed from vault.');
      return true;
    } catch (err) {
      toast.error(err.message || 'Error deleting product.');
      return false;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(prev => prev.map(p => p.id === id ? data.product : p));
      toast.success('Product details updated successfully.');
      return true;
    } catch (err) {
      toast.error(err.message || 'Error updating product.');
      return false;
    }
  };

  // User Profile edit
  const updateUserProfile = async (email, updatedFields) => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.user);
      setUsers(prev => prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, ...updatedFields } : u));
      toast.success('Your profile details have been saved.');
      return true;
    } catch (err) {
      toast.error(err.message || 'Error updating profile.');
      return false;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => prev.map(o => o.id === id ? data.order : o));
      toast.success(`Order status updated to: ${status}`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error updating order status.');
      return false;
    }
  };

  // Admin control access
  const toggleAdminAccess = async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/users/${email}/toggle-access`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(prev => prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, hasAdminAccess: data.hasAdminAccess } : u));
      if (user && user.email.toLowerCase() === email.toLowerCase()) {
        setUser(prev => ({ ...prev, hasAdminAccess: data.hasAdminAccess }));
      }
      toast.success(`Access updated successfully.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error toggling access.');
      return false;
    }
  };

  const updateAdminCredentials = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/admin/credentials`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAdminCredentials({ username: data.username, password: data.password });
      toast.success('Admin credentials updated.');
      return true;
    } catch (err) {
      toast.error(err.message || 'Error updating credentials.');
      return false;
    }
  };

  // CMS delete helpers
  const deleteCategory = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCategories(data.config.categories);
      toast.error(`Category ${name} deleted.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error deleting category.');
      return false;
    }
  };

  const deleteFestival = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/festivals/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setFestivals(data.config.festivals);
      toast.error(`Festival tag ${name} deleted.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error deleting festival.');
      return false;
    }
  };

  const deleteCulture = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/cultures/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCultures(data.config.cultures);
      toast.error(`Culture config ${name} deleted.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error deleting culture.');
      return false;
    }
  };

  const deleteOccasion = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/occasions/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOccasions(data.config.occasions);
      toast.error(`Occasion ${name} deleted.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error deleting occasion.');
      return false;
    }
  };

  // CMS CRUD
  const addCategory = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCategories(data.config.categories);
      toast.success(`Category ${name} created.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error creating category.');
      return false;
    }
  };

  const addFestival = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/festivals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setFestivals(data.config.festivals);
      toast.success(`Festival tag ${name} created.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error creating festival.');
      return false;
    }
  };

  const addCulture = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/cultures`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCultures(data.config.cultures);
      toast.success(`Culture config ${name} created.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error creating culture.');
      return false;
    }
  };

  const addOccasion = async (name) => {
    try {
      const res = await fetch(`${API_URL}/cms/occasions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOccasions(data.config.occasions);
      toast.success(`Occasion ${name} created.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Error creating occasion.');
      return false;
    }
  };

  // Cart operations
  const addToCart = (product, qty = 1, start = '', end = '') => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      const defaultStart = start || new Date().toISOString().split('T')[0];
      const defaultEnd = end || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { product, qty, startDate: defaultStart, endDate: defaultEnd }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item.product.id !== productId));
    toast.error(`Item removed from cart.`);
  };

  const updateCartQty = (productId, qty) => {
    setCart((prev) =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist operations
  const toggleWishlist = (productId) => {
    let active = false;
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        active = false;
        return prev.filter(id => id !== productId);
      } else {
        active = true;
        return [...prev, productId];
      }
    });
    const item = products.find(p => p.id === productId);
    if (active) {
      toast.success(`${item?.name} added to wishlist!`);
    } else {
      toast.error(`Removed from wishlist.`);
    }
  };

  // Auth operations
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('luxe_token', data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      fetchUserData(data.token, data.user);
      return true;
    } catch (err) {
      toast.error(err.message || 'Incorrect login credentials.');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('luxe_token', data.token);
      setUser(data.user);
      toast.success(`Account registered successfully. Welcome!`);
      fetchUserData(data.token, data.user);
      return true;
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('luxe_token');
    setUser(null);
    setUsers([]);
    setOrders([]);
    toast.success(`Logged out successfully.`);
  };

  const addProductReview = (productId, review) => {
    toast.success('Thank you! Your review has been recorded.');
  };

  const addTicket = (subject, desc) => {
    const newTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      subject,
      status: 'Open',
      message: desc
    };
    setTickets(prev => [newTicket, ...prev]);
    toast.success(`Support ticket ${newTicket.id} created!`);
  };

  const placeOrder = async (totalAmount) => {
    try {
      const items = cart.map(c => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        const diff = Math.max(0, end.getTime() - start.getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
        return {
          productId: c.product.id,
          name: c.product.name,
          dailyRent: c.product.dailyRent,
          qty: c.qty,
          days
        };
      });

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ total: totalAmount, items })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => [data.order, ...prev]);
      clearCart();
      toast.success(`Booking Placed! Order: ${data.order.orderId}`);
      return data.order.orderId;
    } catch (err) {
      toast.error(err.message || 'Error booking order.');
      return false;
    }
  };

  const returnOrder = async (orderId) => {
    try {
      const localOrd = orders.find(o => o.orderId === orderId || o.id === orderId);
      if (!localOrd) throw new Error("Order session not found.");

      const res = await fetch(`${API_URL}/orders/${localOrd.id}/return`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
      toast.success(`Return Request Initiated! Secure transit collection scheduled.`, {
        duration: 5000
      });
      return true;
    } catch (err) {
      toast.error(err.message || 'Error initiating return.');
      return false;
    }
  };

  return (
    <LuxeContext.Provider value={{
      products,
      cart,
      wishlist,
      user,
      users,
      adminCredentials,
      orders,
      tickets,
      categories,
      festivals,
      cultures,
      occasions,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      updateUserProfile,
      toggleAdminAccess,
      updateAdminCredentials,
      addCategory,
      deleteCategory,
      addFestival,
      deleteFestival,
      addCulture,
      deleteCulture,
      addOccasion,
      deleteOccasion,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      login,
      register,
      logout,
      placeOrder,
      returnOrder,
      addProductReview,
      addTicket,
      setUser
    }}>
      {children}
    </LuxeContext.Provider>
  );
}

export function useLuxe() {
  return useContext(LuxeContext);
}
