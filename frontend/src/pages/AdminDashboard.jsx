import React, { useState, useMemo } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const { 
    products, addProduct, updateProduct, deleteProduct, 
    orders, updateOrderStatus, 
    categories, festivals, cultures, occasions,
    addCategory, deleteCategory,
    addFestival, deleteFestival,
    addCulture, deleteCulture,
    addOccasion, deleteOccasion,
    users, toggleAdminAccess,
    adminCredentials, updateAdminCredentials,
    user
  } = useLuxe();

  // Authentication States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState('analytics');

  // Product Add Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0] || 'Premium Jewelry');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMaterial, setNewProdMaterial] = useState('');
  const [newProdWeight, setNewProdWeight] = useState('');
  const [newProdSize, setNewProdSize] = useState('Standard');
  const [newProdRent, setNewProdRent] = useState(50);
  const [newProdDeposit, setNewProdDeposit] = useState(400);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400');
  const [newProdOccasions, setNewProdOccasions] = useState([]);
  const [newProdFestivals, setNewProdFestivals] = useState([]);
  const [newProdCulture, setNewProdCulture] = useState('');

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdMaterial, setEditProdMaterial] = useState('');
  const [editProdWeight, setEditProdWeight] = useState('');
  const [editProdSize, setEditProdSize] = useState('');
  const [editProdRent, setEditProdRent] = useState(0);
  const [editProdDeposit, setEditProdDeposit] = useState(0);
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdOccasions, setEditProdOccasions] = useState([]);
  const [editProdFestivals, setEditProdFestivals] = useState([]);
  const [editProdCulture, setEditProdCulture] = useState('');

  // Settings Form State
  const [newAdminId, setNewAdminId] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState(adminCredentials.password);

  // CMS Add State
  const [newCatName, setNewCatName] = useState('');
  const [newFestName, setNewFestName] = useState('');
  const [newCultName, setNewCultName] = useState('');
  const [newOccName, setNewOccName] = useState('');

  // Handle Admin Authentication
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (
      adminIdInput === adminCredentials.username && 
      adminPasswordInput === adminCredentials.password
    ) {
      setIsAdminAuthenticated(true);
      toast.success('Admin Dashboard unlocked.');
    } else {
      const foundUser = users.find(u => 
        (u.email.toLowerCase() === adminIdInput.toLowerCase() || u.name.toLowerCase() === adminIdInput.toLowerCase()) && 
        u.password === adminPasswordInput && 
        u.hasAdminAccess
      );
      if (foundUser) {
        setIsAdminAuthenticated(true);
        toast.success(`Admin Dashboard unlocked as ${foundUser.name}.`);
      } else {
        toast.error('Invalid Administrator credentials.');
      }
    }
  };

  // Stats computation
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const activeCount = orders.filter(o => o.status === 'Active').length;
    return {
      revenue: totalRevenue,
      activeRentals: activeCount,
      totalUsers: users.length,
      totalProducts: products.length
    };
  }, [orders, users, products]);

  // Product Create Handler
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc || !newProdMaterial) {
      toast.error('Please fill in required fields.');
      return;
    }

    addProduct({
      name: newProdName,
      category: newProdCategory,
      description: newProdDesc,
      material: newProdMaterial,
      weight: newProdWeight || 'N/A',
      size: newProdSize,
      dailyRent: Number(newProdRent),
      deposit: Number(newProdDeposit),
      image: newProdImage,
      occasions: newProdOccasions,
      festivals: newProdFestivals,
      culture: newProdCulture
    });

    // Reset Form
    setNewProdName('');
    setNewProdDesc('');
    setNewProdMaterial('');
    setNewProdWeight('');
    setNewProdOccasions([]);
    setNewProdFestivals([]);
    setNewProdCulture('');
  };

  // Product Edit Trigger
  const startEditProduct = (prod) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdCategory(prod.category);
    setEditProdDesc(prod.description);
    setEditProdMaterial(prod.material);
    setEditProdWeight(prod.weight || '');
    setEditProdSize(prod.size || 'Standard');
    setEditProdRent(prod.dailyRent);
    setEditProdDeposit(prod.deposit);
    setEditProdImage(prod.image);
    setEditProdOccasions(prod.occasions || []);
    setEditProdFestivals(prod.festivals || []);
    setEditProdCulture(prod.culture || '');
  };

  // Product Edit Save Handler
  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    if (!editProdName || !editProdDesc || !editProdMaterial) {
      toast.error('Fill in all required fields.');
      return;
    }
    updateProduct(editingProduct.id, {
      name: editProdName,
      category: editProdCategory,
      description: editProdDesc,
      material: editProdMaterial,
      weight: editProdWeight,
      size: editProdSize,
      dailyRent: Number(editProdRent),
      deposit: Number(editProdDeposit),
      image: editProdImage,
      occasions: editProdOccasions,
      festivals: editProdFestivals,
      culture: editProdCulture
    });
    setEditingProduct(null);
  };

  // settings update handler
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (!newAdminId || !newAdminPass) return toast.error('Fields cannot be empty.');
    updateAdminCredentials(newAdminId, newAdminPass);
  };

  // CMS Add Submissions
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory(newCatName);
    setNewCatName('');
  };

  const handleAddFestivalSubmit = (e) => {
    e.preventDefault();
    if (!newFestName) return;
    addFestival(newFestName);
    setNewFestName('');
  };

  const handleAddCultureSubmit = (e) => {
    e.preventDefault();
    if (!newCultName) return;
    addCulture(newCultName);
    setNewCultName('');
  };

  const handleAddOccasionSubmit = (e) => {
    e.preventDefault();
    if (!newOccName) return;
    addOccasion(newOccName);
    setNewOccName('');
  };

  // Render Login Lock Screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
        <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-[0.3em] text-luxury-gold uppercase font-semibold">SECURITY CONTROL</span>
            <h1 className="text-2xl font-serif text-white">Administrator Lock</h1>
            <p className="text-xs text-slate-500">Provide authorization keys to access dashboard panels</p>
          </div>

          {user && user.hasAdminAccess && (
            <div className="p-4 bg-gold-950/20 border border-gold-500/20 rounded-lg text-center space-y-3">
              <p className="text-xs text-slate-300">
                You are logged in as <strong className="text-luxury-gold">{user.name}</strong> with Admin access.
              </p>
              <button 
                onClick={() => {
                  setIsAdminAuthenticated(true);
                  toast.success(`Welcome back, admin ${user.name}!`);
                }}
                className="w-full py-2 bg-gold-500 text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                Quick Enter Dashboard
              </button>
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[9px] text-slate-500 uppercase tracking-widest">Or Use Credentials</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Admin ID</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. amit9115"
                value={adminIdInput} 
                onChange={(e) => setAdminIdInput(e.target.value)} 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Access Password</label>
              <input 
                type="password" 
                required 
                placeholder="•••••"
                value={adminPasswordInput} 
                onChange={(e) => setAdminPasswordInput(e.target.value)} 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
              />
            </div>
            <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-slate-900 pb-6 gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-luxury-gold uppercase">TRINKETS BACKOFFICE</span>
          <h1 className="text-3xl font-serif text-white font-medium">Administrator Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAdminAuthenticated(false)}
            className="px-4 py-2 bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded uppercase tracking-wider hover:bg-rose-900/10 cursor-pointer"
          >
            Lock Terminal
          </button>
        </div>
      </div>

      {/* Analytics Counter Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 text-left">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Total Revenue</span>
          <h4 className="text-2xl font-serif text-white mt-1">${stats.revenue}</h4>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 text-left">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Active Rentals</span>
          <h4 className="text-2xl font-serif text-white mt-1">{stats.activeRentals}</h4>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 text-left">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Registered Clients</span>
          <h4 className="text-2xl font-serif text-white mt-1">{stats.totalUsers}</h4>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 text-left">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Vault Catalog</span>
          <h4 className="text-2xl font-serif text-white mt-1">{stats.totalProducts} items</h4>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-900 overflow-x-auto gap-2 pb-px text-xs uppercase tracking-widest">
        {[
          { id: 'analytics', label: 'Overview' },
          { id: 'products', label: 'Products' },
          { id: 'orders', label: 'Rentals & Orders' },
          { id: 'cms', label: 'Events CMS' },
          { id: 'users', label: 'Client Base' },
          { id: 'settings', label: 'Security Keys' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setEditingProduct(null); // Reset editing form when switching tabs
            }}
            className={`px-4 py-3 border-b-2 font-medium transition-all ${
              activeTab === tab.id
                ? 'border-luxury-gold text-luxury-gold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">

        {/* 1. OVERVIEW / ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            <div className="lg:col-span-8 glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Recent System Events</h3>
              <div className="space-y-3 text-xs text-slate-400 font-light">
                <div className="p-3 bg-luxury-dark/40 rounded flex justify-between">
                  <span>System loaded from persistent store successfully.</span>
                  <span className="text-slate-500">Just Now</span>
                </div>
                <div className="p-3 bg-luxury-dark/40 rounded flex justify-between">
                  <span>Admin settings initialized correctly.</span>
                  <span className="text-slate-500">10m ago</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Operational Guidelines</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                As administrator, you have full write access to the catalog. Any edits, additions, or event adjustments will sync dynamically and instantly display in the site header and store section pages.
              </p>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB (Editable List & Creator) */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            
            {/* Left side: Product List */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Catalog Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-400 font-light">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-widest text-[9px]">
                      <th className="py-2">Item</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Rent / Deposit</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-slate-900/50 hover:bg-slate-950/20">
                        <td className="py-3 pr-2 font-normal text-white flex items-center gap-3">
                          <img src={p.image} className="w-8 h-8 rounded object-cover" alt="" />
                          <span>{p.name}</span>
                        </td>
                        <td className="py-3">{p.category}</td>
                        <td className="py-3">${p.dailyRent} / ${p.deposit}</td>
                        <td className="py-3 text-right space-x-2">
                          <button 
                            onClick={() => startEditProduct(p)} 
                            className="px-2 py-1 text-gold-500 bg-gold-950/20 border border-gold-500/20 rounded hover:bg-gold-500/30 transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteProduct(p.id)} 
                            className="px-2 py-1 text-rose-500 bg-rose-950/20 border border-rose-500/20 rounded hover:bg-rose-500/30 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right side: Add / Edit Form */}
            <div className="lg:col-span-5">
              {!editingProduct ? (
                // Add Product Form
                <div className="glass-panel p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Add New Vault Piece</h3>
                  <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs text-slate-300">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Product Name *</label>
                      <input type="text" required value={newProdName} onChange={(e) => setNewProdName(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Category *</label>
                        <select value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none uppercase">
                          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Size Option</label>
                        <input type="text" value={newProdSize} onChange={(e) => setNewProdSize(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Weight</label>
                        <input type="text" placeholder="e.g. 15g" value={newProdWeight} onChange={(e) => setNewProdWeight(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Daily Rent *</label>
                        <input type="number" required value={newProdRent} onChange={(e) => setNewProdRent(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Security Deposit *</label>
                        <input type="number" required value={newProdDeposit} onChange={(e) => setNewProdDeposit(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Image URL</label>
                      <input type="text" value={newProdImage} onChange={(e) => setNewProdImage(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Occasions (Select Multiple)</label>
                        <div className="space-y-1 max-h-28 overflow-y-auto border border-slate-800 p-2 rounded bg-luxury-dark/40">
                          {occasions.map((o) => (
                            <label key={o} className="flex items-center gap-2 cursor-pointer py-0.5">
                              <input 
                                type="checkbox" 
                                checked={newProdOccasions.includes(o)} 
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewProdOccasions(prev => [...prev, o]);
                                  } else {
                                    setNewProdOccasions(prev => prev.filter(item => item !== o));
                                  }
                                }}
                                className="rounded border-slate-800 bg-luxury-charcoal text-gold-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-300 uppercase">{o}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Festivals (Select Multiple)</label>
                        <div className="space-y-1 max-h-28 overflow-y-auto border border-slate-800 p-2 rounded bg-luxury-dark/40">
                          {festivals.map((f) => (
                            <label key={f} className="flex items-center gap-2 cursor-pointer py-0.5">
                              <input 
                                type="checkbox" 
                                checked={newProdFestivals.includes(f)} 
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewProdFestivals(prev => [...prev, f]);
                                  } else {
                                    setNewProdFestivals(prev => prev.filter(item => item !== f));
                                  }
                                }}
                                className="rounded border-slate-800 bg-luxury-charcoal text-gold-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-300 uppercase">{f}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Culture</label>
                        <select value={newProdCulture} onChange={(e) => setNewProdCulture(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none uppercase h-10">
                          <option value="">None</option>
                          {cultures.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Material Specifications *</label>
                      <input type="text" required value={newProdMaterial} onChange={(e) => setNewProdMaterial(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Detailed Description *</label>
                      <textarea required value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} rows="3" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none"></textarea>
                    </div>
                    <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs uppercase rounded hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">Add Product</button>
                  </form>
                </div>
              ) : (
                // Edit Product Form
                <div className="glass-panel p-6 rounded-xl space-y-4 border border-gold-500/20">
                  <h3 className="text-lg font-serif text-luxury-gold border-b border-slate-900 pb-2">Edit Product: ID {editingProduct.id}</h3>
                  <form onSubmit={handleEditProductSubmit} className="space-y-3.5 text-xs text-slate-300">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Product Name *</label>
                      <input type="text" required value={editProdName} onChange={(e) => setEditProdName(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Category *</label>
                        <select value={editProdCategory} onChange={(e) => setEditProdCategory(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none uppercase">
                          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Size Option</label>
                        <input type="text" value={editProdSize} onChange={(e) => setEditProdSize(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Weight</label>
                        <input type="text" value={editProdWeight} onChange={(e) => setEditProdWeight(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Daily Rent *</label>
                        <input type="number" required value={editProdRent} onChange={(e) => setEditProdRent(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Security Deposit *</label>
                        <input type="number" required value={editProdDeposit} onChange={(e) => setEditProdDeposit(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Image URL</label>
                      <input type="text" value={editProdImage} onChange={(e) => setEditProdImage(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Occasions (Select Multiple)</label>
                        <div className="space-y-1 max-h-28 overflow-y-auto border border-slate-800 p-2 rounded bg-luxury-dark/40">
                          {occasions.map((o) => (
                            <label key={o} className="flex items-center gap-2 cursor-pointer py-0.5">
                              <input 
                                type="checkbox" 
                                checked={editProdOccasions.includes(o)} 
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditProdOccasions(prev => [...prev, o]);
                                  } else {
                                    setEditProdOccasions(prev => prev.filter(item => item !== o));
                                  }
                                }}
                                className="rounded border-slate-800 bg-luxury-charcoal text-gold-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-300 uppercase">{o}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Festivals (Select Multiple)</label>
                        <div className="space-y-1 max-h-28 overflow-y-auto border border-slate-800 p-2 rounded bg-luxury-dark/40">
                          {festivals.map((f) => (
                            <label key={f} className="flex items-center gap-2 cursor-pointer py-0.5">
                              <input 
                                type="checkbox" 
                                checked={editProdFestivals.includes(f)} 
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditProdFestivals(prev => [...prev, f]);
                                  } else {
                                    setEditProdFestivals(prev => prev.filter(item => item !== f));
                                  }
                                }}
                                className="rounded border-slate-800 bg-luxury-charcoal text-gold-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-300 uppercase">{f}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Culture</label>
                        <select value={editProdCulture} onChange={(e) => setEditProdCulture(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none uppercase h-10">
                          <option value="">None</option>
                          {cultures.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Material Specs *</label>
                      <input type="text" required value={editProdMaterial} onChange={(e) => setEditProdMaterial(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1">Detailed Description *</label>
                      <textarea required value={editProdDesc} onChange={(e) => setEditProdDesc(e.target.value)} rows="3" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-200 focus:outline-none"></textarea>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 py-2 gold-gradient-bg text-luxury-black font-semibold text-xs uppercase rounded cursor-pointer">Save Changes</button>
                      <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-2 border border-slate-800 text-slate-400 font-semibold text-xs uppercase rounded cursor-pointer">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. ORDERS & RENTALS TAB */}
        {activeTab === 'orders' && (
          <div className="glass-panel p-6 rounded-xl space-y-4 text-left animate-fade-up">
            <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Active Rental Orders & Billing</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-400 font-light">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-widest text-[9px]">
                    <th className="py-2">Reference</th>
                    <th className="py-2">Client Details</th>
                    <th className="py-2">Items Rented</th>
                    <th className="py-2">Invoice Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} className="border-b border-slate-900/50 hover:bg-slate-950/20">
                      <td className="py-3 font-semibold text-white">{ord.id}</td>
                      <td className="py-3">
                        <div className="font-normal text-slate-200">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-500">{ord.customerEmail}</div>
                      </td>
                      <td className="py-3">
                        {ord.items.map((i, idx) => (
                          <div key={idx}>
                            • {i.name} (x{i.qty || 1}) - {i.days || 3} days
                          </div>
                        ))}
                      </td>
                      <td className="py-3 font-semibold text-white">${ord.total}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${
                          ord.status === 'Active' 
                            ? 'bg-gold-950/20 text-luxury-gold border-gold-500/20' 
                            : ord.status === 'Returned' 
                            ? 'bg-slate-900 text-slate-400 border-slate-800' 
                            : 'bg-rose-950/20 text-rose-400 border-rose-500/20'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        {ord.status === 'Active' && (
                          <>
                            <button onClick={() => updateOrderStatus(ord.id, 'Returned')} className="px-2 py-1 text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-all cursor-pointer">Returned</button>
                            <button onClick={() => updateOrderStatus(ord.id, 'Damaged')} className="px-2 py-1 text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 rounded transition-all cursor-pointer">Damaged</button>
                          </>
                        )}
                        {ord.status !== 'Active' && (
                          <button onClick={() => updateOrderStatus(ord.id, 'Active')} className="px-2 py-1 text-gold-500 bg-gold-950/20 hover:bg-gold-950/40 rounded transition-all cursor-pointer">Reset Active</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. CMS TAB (Add & Delete Events) */}
        {activeTab === 'cms' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up text-left">
            {/* Category CMS */}
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">Categories</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-light max-h-48 overflow-y-auto pr-1">
                {categories.map((c, idx) => (
                  <li key={idx} className="flex justify-between items-center p-1.5 bg-luxury-dark/40 rounded border border-slate-900">
                    <span>{c}</span>
                    <button 
                      onClick={() => deleteCategory(c)} 
                      className="text-rose-500 hover:text-rose-400 text-xs px-1 focus:outline-none cursor-pointer"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddCategorySubmit} className="flex gap-2 pt-2 border-t border-slate-900">
                <input type="text" placeholder="New Category" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded hover:opacity-90 transition-opacity cursor-pointer">+</button>
              </form>
            </div>

            {/* Festivals CMS */}
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">Festivals</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-light max-h-48 overflow-y-auto pr-1">
                {festivals.map((f, idx) => (
                  <li key={idx} className="flex justify-between items-center p-1.5 bg-luxury-dark/40 rounded border border-slate-900">
                    <span>{f}</span>
                    <button 
                      onClick={() => deleteFestival(f)} 
                      className="text-rose-500 hover:text-rose-400 text-xs px-1 focus:outline-none cursor-pointer"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddFestivalSubmit} className="flex gap-2 pt-2 border-t border-slate-900">
                <input type="text" placeholder="New Festival" value={newFestName} onChange={(e) => setNewFestName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded hover:opacity-90 transition-opacity cursor-pointer">+</button>
              </form>
            </div>

            {/* Cultures CMS */}
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">Cultures</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-light max-h-48 overflow-y-auto pr-1">
                {cultures.map((c, idx) => (
                  <li key={idx} className="flex justify-between items-center p-1.5 bg-luxury-dark/40 rounded border border-slate-900">
                    <span>{c}</span>
                    <button 
                      onClick={() => deleteCulture(c)} 
                      className="text-rose-500 hover:text-rose-400 text-xs px-1 focus:outline-none cursor-pointer"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddCultureSubmit} className="flex gap-2 pt-2 border-t border-slate-900">
                <input type="text" placeholder="New Culture" value={newCultName} onChange={(e) => setNewCultName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded hover:opacity-90 transition-opacity cursor-pointer">+</button>
              </form>
            </div>

            {/* Occasions CMS */}
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">Occasions (Events)</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-light max-h-48 overflow-y-auto pr-1">
                {occasions.map((o, idx) => (
                  <li key={idx} className="flex justify-between items-center p-1.5 bg-luxury-dark/40 rounded border border-slate-900">
                    <span>{o}</span>
                    <button 
                      onClick={() => deleteOccasion(o)} 
                      className="text-rose-500 hover:text-rose-400 text-xs px-1 focus:outline-none cursor-pointer"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddOccasionSubmit} className="flex gap-2 pt-2 border-t border-slate-900">
                <input type="text" placeholder="New Event" value={newOccName} onChange={(e) => setNewOccName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded hover:opacity-90 transition-opacity cursor-pointer">+</button>
              </form>
            </div>
          </div>
        )}

        {/* 5. CLIENT BASE TAB (Registered Users & Access Control) */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-xl space-y-4 text-left animate-fade-up">
            <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Registered Customer Accounts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-400 font-light">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-widest text-[9px]">
                    <th className="py-2">Client</th>
                    <th className="py-2">Contact Details</th>
                    <th className="py-2">Address</th>
                    <th className="py-2">Admin Status</th>
                    <th className="py-2 text-right">Dashboard Access Control</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-b border-slate-900/50 hover:bg-slate-950/20">
                      <td className="py-3 font-normal text-white flex items-center gap-3">
                        <img src={u.avatar} className="w-8 h-8 rounded-full border border-gold-500/10 object-cover" alt="" />
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3">
                        <div className="text-slate-200">{u.email}</div>
                        <div className="text-[10px] text-slate-500">{u.phone}</div>
                      </td>
                      <td className="py-3">{u.address}</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                          u.hasAdminAccess 
                            ? 'bg-gold-500/10 text-luxury-gold border-gold-500/20' 
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}>
                          {u.hasAdminAccess ? 'Admin Allowed' : 'Client Profile Only'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => toggleAdminAccess(u.email)} 
                          className={`px-3 py-1 text-[10px] font-semibold rounded uppercase tracking-wider transition-all cursor-pointer ${
                            u.hasAdminAccess 
                              ? 'bg-rose-950/20 border border-rose-500/20 text-rose-400 hover:bg-rose-900/10' 
                              : 'bg-gold-500/10 border border-gold-500/20 text-gold-300 hover:bg-gold-500/20'
                          }`}
                        >
                          {u.hasAdminAccess ? 'Revoke Access' : 'Grant Admin Access'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. SETTINGS TAB (Admin Security Credentials) */}
        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto text-left animate-fade-up">
            <div className="glass-panel p-6 rounded-xl border border-slate-800/80 space-y-4">
              <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Change Administrator Keys</h3>
              <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">New Admin ID</label>
                  <input 
                    type="text" 
                    required 
                    value={newAdminId} 
                    onChange={(e) => setNewAdminId(e.target.value)} 
                    className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold-500" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">New Access Password</label>
                  <input 
                    type="password" 
                    required 
                    value={newAdminPass} 
                    onChange={(e) => setNewAdminPass(e.target.value)} 
                    className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold-500" 
                  />
                </div>
                <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">Update Access Credentials</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
