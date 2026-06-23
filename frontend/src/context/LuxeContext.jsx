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
  }
];

export function LuxeProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('luxe_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('luxe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('luxe_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('luxe_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ORD-82618',
        customerName: 'Aria Sterling',
        customerEmail: 'aria@sterling.com',
        date: '2026-05-12',
        total: 1358,
        status: 'Returned',
        items: [
          { productId: 2, name: 'Royal Kundan Choker Set', dailyRent: 95, qty: 1, days: 3 }
        ]
      }
    ];
  });
  const [tickets, setTickets] = useState([
    { id: 'TCK-102', subject: 'Custom Sizing Query', status: 'Closed', message: 'Resolved by support team' }
  ]);

  // CMS Configurations State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('luxe_categories');
    return saved ? JSON.parse(saved) : ['Premium Jewelry', 'Temple Jewelry', 'Cultural Jewelry', 'Traditional Jewelry'];
  });
  const [festivals, setFestivals] = useState(() => {
    const saved = localStorage.getItem('luxe_festivals');
    return saved ? JSON.parse(saved) : ['Diwali Sparkle', 'Eid Opulence', 'Navratri Heritage'];
  });
  const [cultures, setCultures] = useState(() => {
    const saved = localStorage.getItem('luxe_cultures');
    return saved ? JSON.parse(saved) : ['Mughal Heritage', 'South Indian Divine', 'Rajputana Royalty', 'Victorian Elegance'];
  });
  const [occasions, setOccasions] = useState(() => {
    const saved = localStorage.getItem('luxe_occasions');
    return saved ? JSON.parse(saved) : ['Wedding Jewelry', 'Haldi Collection', 'Mehndi Collection', 'Engagement Collection', 'Reception Collection'];
  });

  useEffect(() => {
    localStorage.setItem('luxe_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('luxe_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('luxe_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('luxe_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('luxe_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('luxe_festivals', JSON.stringify(festivals));
  }, [festivals]);

  useEffect(() => {
    localStorage.setItem('luxe_cultures', JSON.stringify(cultures));
  }, [cultures]);

  useEffect(() => {
    localStorage.setItem('luxe_occasions', JSON.stringify(occasions));
  }, [occasions]);

  // Product CRUD
  const addProduct = (prod) => {
    const newProduct = {
      ...prod,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      rating: 5.0
    };
    setProducts(prev => [...prev, newProduct]);
    toast.success(`${newProduct.name} added to vault!`);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.error('Item removed from vault.');
  };

  // Order CRUD
  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status } : o
    ));
    toast.success(`Order ${orderId} updated to: ${status}`);
  };

  // CMS CRUD
  const addCategory = (name) => {
    setCategories(prev => [...prev, name]);
    toast.success(`Category ${name} created.`);
  };

  const addFestival = (name) => {
    setFestivals(prev => [...prev, name]);
    toast.success(`Festival tag ${name} created.`);
  };

  const addCulture = (name) => {
    setCultures(prev => [...prev, name]);
    toast.success(`Culture config ${name} created.`);
  };

  const addOccasion = (name) => {
    setOccasions(prev => [...prev, name]);
    toast.success(`Occasion ${name} created.`);
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
  const login = (email, password) => {
    const name = email.split('@')[0];
    const mockUser = {
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      phone: '+1 (555) 902-8822',
      address: '742 Park Avenue, New York, NY 10021',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };
    setUser(mockUser);
    toast.success(`Welcome back, ${mockUser.name}!`);
    return true;
  };

  const register = (name, email, password) => {
    const mockUser = {
      email,
      name,
      phone: '+1 (555) 123-4567',
      address: 'Please set your shipping address',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };
    setUser(mockUser);
    toast.success(`Profile registered. Welcome!`);
    return true;
  };

  const logout = () => {
    setUser(null);
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

  const placeOrder = (totalAmount) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: user ? user.name : 'Guest User',
      customerEmail: user ? user.email : 'guest@example.com',
      date: new Date().toISOString().split('T')[0],
      total: totalAmount,
      status: 'Active',
      items: cart.map(c => {
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
      })
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    toast.success(`Booking Placed! Order: ${newOrder.id}`);
    return newOrder.id;
  };

  const returnOrder = (orderId) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Returned' } : o
    ));
    toast.success(`Return Request Initiated! Secure transit collection for ${orderId} scheduled. Refund of deposit initiated.`, {
      duration: 5000
    });
  };

  return (
    <LuxeContext.Provider value={{
      products,
      cart,
      wishlist,
      user,
      orders,
      tickets,
      categories,
      festivals,
      cultures,
      occasions,
      addProduct,
      deleteProduct,
      updateOrderStatus,
      addCategory,
      addFestival,
      addCulture,
      addOccasion,
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
