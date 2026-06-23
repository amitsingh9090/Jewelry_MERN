import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const { 
    products, addProduct, deleteProduct, 
    orders, updateOrderStatus, 
    categories, festivals, cultures, occasions,
    addCategory, addFestival, addCulture, addOccasion
  } = useLuxe();

  const [activeTab, setActiveTab] = useState('analytics');

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0] || 'Premium Jewelry');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMaterial, setNewProdMaterial] = useState('');
  const [newProdWeight, setNewProdWeight] = useState('');
  const [newProdSize, setNewProdSize] = useState('Standard');
  const [newProdRent, setNewProdRent] = useState(50);
  const [newProdDeposit, setNewProdDeposit] = useState(400);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400');
  const [newProdOccasion, setNewProdOccasion] = useState('');
  const [newProdFestival, setNewProdFestival] = useState('');
  const [newProdCulture, setNewProdCulture] = useState('');

  // CMS Add State
  const [newCatName, setNewCatName] = useState('');
  const [newFestName, setNewFestName] = useState('');
  const [newCultName, setNewCultName] = useState('');
  const [newOccName, setNewOccName] = useState('');

  // Mock User Database (Including personal and rental details)
  const [mockCustomers] = useState([
    { name: 'Aria Sterling', email: 'aria@sterling.com', phone: '+1 (555) 902-8822', activeRentals: 0, totalPaid: 1358 },
    { name: 'Lady Isabella Sterling', email: 'isabella@sterling.com', phone: '+1 (555) 234-5678', activeRentals: 1, totalPaid: 2500 },
    { name: 'Duchess Clara Windsor', email: 'clara@windsor.org', phone: '+1 (555) 890-1234', activeRentals: 2, totalPaid: 4800 },
    { name: 'Lord Sebastian Grey', email: 'sebastian@grey.co', phone: '+1 (555) 765-4321', activeRentals: 0, totalPaid: 950 }
  ]);

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc || !newProdMaterial) {
      toast.error('Please fill in required fields.');
      return;
    }
    const occasionsArray = newProdOccasion ? [newProdOccasion] : [];
    const festivalsArray = newProdFestival ? [newProdFestival] : [];

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
      occasions: occasionsArray,
      festivals: festivalsArray,
      culture: newProdCulture
    });

    // Reset Form
    setNewProdName('');
    setNewProdDesc('');
    setNewProdMaterial('');
    setNewProdWeight('');
    setNewProdOccasion('');
    setNewProdFestival('');
    setNewProdCulture('');
  };

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

  // Calculations for Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 9608;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-900 pb-6">
        <div>
          <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">VALENTINA BACKOFFICE</span>
          <h1 className="text-3xl md:text-4xl font-serif text-white mt-1">Enterprise Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">System Status: Online</span>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 glass-panel p-4 rounded-xl space-y-1">
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'analytics' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
          >
            Analytics Overview
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'products' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
          >
            Product Management ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'users' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
          >
            User Database ({mockCustomers.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'orders' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
          >
            Order Manager ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('cms')} 
            className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'cms' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
          >
            CMS Settings
          </button>
        </div>

        {/* Dashboard Main Display */}
        <div className="lg:col-span-9">
          
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] uppercase text-slate-500 tracking-widest block mb-1">TOTAL REVENUE</span>
                  <strong className="text-xl text-white font-serif">${totalRevenue}</strong>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] uppercase text-slate-500 tracking-widest block mb-1">ACTIVE RENTALS</span>
                  <strong className="text-xl text-white font-serif">{orders.filter(o => o.status === 'Active').length}</strong>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] uppercase text-slate-500 tracking-widest block mb-1">DATABASE CUSTOMERS</span>
                  <strong className="text-xl text-white font-serif">{mockCustomers.length}</strong>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] uppercase text-slate-500 tracking-widest block mb-1">TOTAL INVENTORY</span>
                  <strong className="text-xl text-white font-serif">{products.length} Pieces</strong>
                </div>
              </div>

              {/* Graphic Chart representation */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-base font-serif text-white">Monthly Rental Inflow</h3>
                <div className="h-48 flex items-end justify-between gap-4 pt-6 border-b border-slate-800">
                  <div className="w-full bg-slate-900/60 rounded h-full flex flex-col justify-end items-center"><div className="w-6 bg-gold-900 rounded-t h-[35%]" /><span className="text-[9px] text-slate-500 mt-2">JAN</span></div>
                  <div className="w-full bg-slate-900/60 rounded h-full flex flex-col justify-end items-center"><div className="w-6 bg-gold-900 rounded-t h-[48%]" /><span className="text-[9px] text-slate-500 mt-2">FEB</span></div>
                  <div className="w-full bg-slate-900/60 rounded h-full flex flex-col justify-end items-center"><div className="w-6 bg-gold-900 rounded-t h-[65%]" /><span className="text-[9px] text-slate-500 mt-2">MAR</span></div>
                  <div className="w-full bg-slate-900/60 rounded h-full flex flex-col justify-end items-center"><div className="w-6 bg-gold-800 rounded-t h-[80%]" /><span className="text-[9px] text-slate-500 mt-2">APR</span></div>
                  <div className="w-full bg-slate-900/60 rounded h-full flex flex-col justify-end items-center"><div className="w-6 bg-luxury-gold rounded-t h-[95%]" /><span className="text-[9px] text-slate-500 mt-2">MAY</span></div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCT CRUD TAB */}
          {activeTab === 'products' && (
            <div className="space-y-8 animate-fade-up">
              
              {/* Add Product Form */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Add New Luxury Piece</h3>
                <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Name</label>
                      <input type="text" required value={newProdName} onChange={(e) => setNewProdName(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Category</label>
                      <select value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Material</label>
                      <input type="text" required value={newProdMaterial} onChange={(e) => setNewProdMaterial(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Weight</label>
                      <input type="text" value={newProdWeight} onChange={(e) => setNewProdWeight(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Daily Rent ($)</label>
                      <input type="number" required value={newProdRent} onChange={(e) => setNewProdRent(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Security Deposit ($)</label>
                      <input type="number" required value={newProdDeposit} onChange={(e) => setNewProdDeposit(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Image URL</label>
                      <input type="text" required value={newProdImage} onChange={(e) => setNewProdImage(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Wedding Occasion Tag</label>
                      <select value={newProdOccasion} onChange={(e) => setNewProdOccasion(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none">
                        <option value="">None / Standard</option>
                        {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Festival Tag</label>
                      <select value={newProdFestival} onChange={(e) => setNewProdFestival(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none">
                        <option value="">None / Standard</option>
                        {festivals.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Culture Tag</label>
                      <select value={newProdCulture} onChange={(e) => setNewProdCulture(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none">
                        <option value="">None / Standard</option>
                        {cultures.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Description</label>
                    <textarea required value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} rows="3" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-slate-300 focus:outline-none"></textarea>
                  </div>

                  <button type="submit" className="px-6 py-2.5 gold-gradient-bg text-luxury-black font-semibold uppercase tracking-widest rounded-lg">
                    Add Vault Item
                  </button>
                </form>
              </div>

              {/* Products Table list */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-serif text-white">Active Vault Catalog</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-2">Item</th>
                        <th className="py-3 px-2">Category</th>
                        <th className="py-3 px-2 text-right">Rent / Day</th>
                        <th className="py-3 px-2 text-right">Deposit</th>
                        <th className="py-3 px-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-slate-900 hover:bg-luxury-dark/40">
                          <td className="py-3 px-2 flex items-center gap-3">
                            <img src={p.image} className="w-8 h-8 object-cover rounded border border-slate-800" alt="" />
                            <span className="font-serif text-white font-medium">{p.name}</span>
                          </td>
                          <td className="py-3 px-2 text-slate-400">{p.category}</td>
                          <td className="py-3 px-2 text-right text-white font-semibold">${p.dailyRent}</td>
                          <td className="py-3 px-2 text-right text-slate-400">${p.deposit}</td>
                          <td className="py-3 px-2 text-center">
                            <button 
                              onClick={() => deleteProduct(p.id)}
                              className="text-rose-500 hover:text-rose-400 font-semibold px-2"
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

            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="glass-panel p-6 rounded-xl space-y-4 animate-fade-up">
              <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Patron Client Profiles</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Phone</th>
                      <th className="py-3 px-2 text-right">Active Rentals</th>
                      <th className="py-3 px-2 text-right">Total Contributed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCustomers.map((cust, idx) => (
                      <tr key={idx} className="border-b border-slate-900 hover:bg-luxury-dark/40">
                        <td className="py-3 px-2 font-serif text-white font-medium">{cust.name}</td>
                        <td className="py-3 px-2 text-slate-400">{cust.email}</td>
                        <td className="py-3 px-2 text-slate-400">{cust.phone}</td>
                        <td className="py-3 px-2 text-right text-slate-300 font-mono">{cust.activeRentals}</td>
                        <td className="py-3 px-2 text-right text-luxury-gold font-semibold">${cust.totalPaid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDER MANAGER TAB */}
          {activeTab === 'orders' && (
            <div className="glass-panel p-6 rounded-xl space-y-4 animate-fade-up">
              <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Booking Manifest Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-2">Order Ref</th>
                      <th className="py-3 px-2">Patron Name</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2 text-right">Invoice</th>
                      <th className="py-3 px-2 text-center">Status</th>
                      <th className="py-3 px-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} className="border-b border-slate-900 hover:bg-luxury-dark/40">
                        <td className="py-3 px-2 text-white font-semibold">{ord.id}</td>
                        <td className="py-3 px-2 text-slate-400">{ord.customerName || 'Aria Sterling'}</td>
                        <td className="py-3 px-2 text-slate-400">{ord.date}</td>
                        <td className="py-3 px-2 text-right text-white font-bold">${ord.total}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            ord.status === 'Active' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' :
                            ord.status === 'Returned' ? 'bg-slate-900 text-slate-500 border-slate-800' :
                            'bg-rose-950/20 text-rose-400 border-rose-500/20'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 flex justify-center gap-1.5">
                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'Active')}
                            className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[9px]"
                          >
                            Set Active
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'Returned')}
                            className="px-2 py-1 bg-gold-950/20 text-luxury-gold rounded text-[9px] border border-gold-500/10"
                          >
                            Return
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'Damaged')}
                            className="px-2 py-1 bg-rose-950/20 text-rose-400 rounded text-[9px] border border-rose-500/10"
                          >
                            Damaged
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CMS CONFIGURATION TAB */}
          {activeTab === 'cms' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up">
              {/* Category */}
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">CMS Categories</h4>
                <ul className="space-y-1.5 text-xs text-slate-400 font-light max-h-36 overflow-y-auto">
                  {categories.map((c, idx) => <li key={idx}>• {c}</li>)}
                </ul>
                <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                  <input type="text" placeholder="New Category" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                  <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded">+</button>
                </form>
              </div>

              {/* Festivals */}
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">CMS Festivals</h4>
                <ul className="space-y-1.5 text-xs text-slate-400 font-light max-h-36 overflow-y-auto">
                  {festivals.map((f, idx) => <li key={idx}>• {f}</li>)}
                </ul>
                <form onSubmit={handleAddFestivalSubmit} className="flex gap-2">
                  <input type="text" placeholder="New Festival" value={newFestName} onChange={(e) => setNewFestName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                  <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded">+</button>
                </form>
              </div>

              {/* Cultures */}
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">CMS Cultures</h4>
                <ul className="space-y-1.5 text-xs text-slate-400 font-light max-h-36 overflow-y-auto">
                  {cultures.map((c, idx) => <li key={idx}>• {c}</li>)}
                </ul>
                <form onSubmit={handleAddCultureSubmit} className="flex gap-2">
                  <input type="text" placeholder="New Culture" value={newCultName} onChange={(e) => setNewCultName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                  <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded">+</button>
                </form>
              </div>

              {/* Occasions */}
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h4 className="font-serif text-white text-sm border-b border-slate-900 pb-2">CMS Occasions</h4>
                <ul className="space-y-1.5 text-xs text-slate-400 font-light max-h-36 overflow-y-auto">
                  {occasions.map((o, idx) => <li key={idx}>• {o}</li>)}
                </ul>
                <form onSubmit={handleAddOccasionSubmit} className="flex gap-2">
                  <input type="text" placeholder="New Occasion" value={newOccName} onChange={(e) => setNewOccName(e.target.value)} required className="flex-grow bg-luxury-charcoal border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none" />
                  <button type="submit" className="px-3 bg-gold-500 text-luxury-black font-semibold text-xs rounded">+</button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
