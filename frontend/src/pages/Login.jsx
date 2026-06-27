import React, { useState, useMemo } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const { login, logout, user, orders, tickets, addTicket, updateUserProfile, adminCredentials, wishlist, products, toggleWishlist, addToCart, returnOrder } = useLuxe();
  const navigate = useNavigate();
  
  // Tab-based login mode: 'customer' or 'admin'
  const [loginType, setLoginType] = useState('customer');
  
  // Customer Login States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Admin Login States
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
 
  // Support ticket form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Profile Dashboard Active Tab: 'rentals', 'wishlist', 'billing', 'support'
  const [activeProfileTab, setActiveProfileTab] = useState('rentals');
 
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) return toast.error('Please enter both email/phone and password.');
    const success = await login(emailOrPhone.trim(), password, rememberMe);
    if (success) {
      navigate('/');
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (!adminId.trim() || !adminPassword) {
      return toast.error('Please enter both Admin ID and password.');
    }

    try {
      let loggedInUser = null;
      if (
        adminId === adminCredentials.username && 
        adminPassword === adminCredentials.password
      ) {
        // Silently authenticate with the E2E backend admin to get a valid token
        loggedInUser = await login('amit@example.com', 'password123');
      } else {
        // Try direct backend authentication with custom admin login
        loggedInUser = await login(adminId, adminPassword);
      }

      if (loggedInUser && loggedInUser.hasAdminAccess) {
        toast.success(`Admin Session unlocked as ${loggedInUser.name}.`);
        navigate('/admin');
      } else {
        if (loggedInUser) {
          await logout();
          toast.error('This user does not have Administrator privileges.');
        } else {
          toast.error('Invalid Administrator credentials.');
        }
      }
    } catch (err) {
      toast.error('Authentication failed. Backend may be offline.');
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    addTicket(subject, message);
    setSubject('');
    setMessage('');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return toast.error('Name is required');
    updateUserProfile(user.email, {
      name: editName,
      phone: editPhone,
      address: editAddress,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditAddress(user.address || '');
    setEditAvatar(user.avatar || '');
    setIsEditing(true);
  };

  // Filter user specific orders
  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase());
  }, [orders, user]);

  const activeRentals = useMemo(() => {
    return userOrders.filter(o => o.status === 'Active');
  }, [userOrders]);

  const returnedRentals = useMemo(() => {
    return userOrders.filter(o => o.status === 'Returned');
  }, [userOrders]);

  if (user) {
    // Get wishlisted products details
    const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

    return (
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Profile overview & Edit */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-900 space-y-5">
          <div className="text-center space-y-2 relative group">
            <div className="relative w-24 h-24 mx-auto">
              <img src={user.avatar} className="w-24 h-24 rounded-full object-cover border-2 border-gold-500 shadow-xl" alt="" />
              <button 
                onClick={startEditing} 
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer focus:outline-none"
                title="Edit Profile Photo & Details"
              >
                <span className="text-[10px] text-luxury-gold uppercase tracking-wider font-semibold">Edit</span>
              </button>
            </div>
            <div>
              <h2 className="text-xl font-serif text-white">{user.name}</h2>
              <p className="text-[10px] text-luxury-gold uppercase tracking-widest font-semibold">Prestige Club Patron</p>
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-4 pt-4 border-t border-slate-900/60">
              <div className="text-left text-xs text-slate-400 space-y-3">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Email Address</span>
                  <strong className="text-slate-200 font-normal">{user.email}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Phone Contact</span>
                  <strong className="text-slate-200 font-normal">{user.phone || 'Not configured'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Shipping Vault Address</span>
                  <strong className="text-slate-200 font-normal">{user.address || 'Not configured'}</strong>
                </div>
              </div>
              {user.hasAdminAccess && (
                <Link 
                  to="/admin" 
                  className="block w-full py-2.5 text-center bg-gold-500 text-luxury-black font-bold text-xs uppercase tracking-widest rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Enter Admin Dashboard
                </Link>
              )}
              <button 
                onClick={startEditing} 
                className="w-full py-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-semibold rounded-lg uppercase tracking-wider hover:bg-gold-500/25 transition-all cursor-pointer"
              >
                Edit Account Information
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4 border-t border-slate-900/60 text-left">
              {/* Photo Uploader */}
              <div className="flex items-center gap-4 bg-luxury-charcoal/20 p-3 rounded-xl border border-slate-800/80 mb-3">
                <img src={editAvatar} className="w-14 h-14 rounded-full object-cover border border-gold-500/20 bg-luxury-dark" alt="Avatar Preview" />
                <div className="flex-grow space-y-1">
                  <label className="block text-[9px] text-slate-500 uppercase tracking-widest">Profile Photo</label>
                  <label className="inline-block px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[10px] text-luxury-gold font-semibold uppercase rounded tracking-wider border border-gold-500/10 hover:border-gold-500/30 cursor-pointer transition-all">
                    Choose Image File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditAvatar(reader.result); // Base64 representation
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Phone Contact</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Shipping Address</label>
                <textarea 
                  value={editAddress} 
                  onChange={(e) => setEditAddress(e.target.value)} 
                  rows="2"
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 gold-gradient-bg text-luxury-black font-semibold text-xs rounded uppercase tracking-wider">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 border border-slate-800 text-slate-400 text-xs rounded uppercase tracking-wider">Cancel</button>
              </div>
            </form>
          )}

          <button onClick={logout} className="w-full py-2.5 bg-rose-950/15 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg uppercase tracking-wider hover:bg-rose-950/25 transition-all cursor-pointer">Logout Session</button>
        </div>

        {/* Right Side: Tabbed Patron Portal */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-900 gap-6 text-xs uppercase tracking-widest font-semibold pb-1 overflow-x-auto">
            <button 
              onClick={() => setActiveProfileTab('rentals')}
              className={`pb-2.5 transition-all cursor-pointer border-b-2 ${activeProfileTab === 'rentals' ? 'text-luxury-gold border-luxury-gold' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              Rentals Dashboard
            </button>
            <button 
              onClick={() => setActiveProfileTab('wishlist')}
              className={`pb-2.5 transition-all cursor-pointer border-b-2 ${activeProfileTab === 'wishlist' ? 'text-luxury-gold border-luxury-gold' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              Wishlist Vault
            </button>
            <button 
              onClick={() => setActiveProfileTab('billing')}
              className={`pb-2.5 transition-all cursor-pointer border-b-2 ${activeProfileTab === 'billing' ? 'text-luxury-gold border-luxury-gold' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              Invoices & Payments
            </button>
            <button 
              onClick={() => setActiveProfileTab('support')}
              className={`pb-2.5 transition-all cursor-pointer border-b-2 ${activeProfileTab === 'support' ? 'text-luxury-gold border-luxury-gold' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              Patron Support
            </button>
          </div>

          {/* Tab Panels */}
          {activeProfileTab === 'rentals' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Active Bookings */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-4">
                <h3 className="text-base font-serif text-white flex justify-between items-center">
                  <span>Active Vault Rentals</span>
                  <span className="text-[10px] text-luxury-gold bg-gold-950/20 border border-gold-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{activeRentals.length} active</span>
                </h3>
                {activeRentals.length === 0 ? (
                  <p className="text-xs text-slate-500 font-light py-4">No active rentals currently booked.</p>
                ) : (
                  <div className="space-y-6">
                    {activeRentals.map((ord) => (
                      <div key={ord.id} className="p-4 border border-slate-800 rounded-xl text-xs space-y-4 bg-luxury-charcoal/15">
                        <div className="flex justify-between items-center text-slate-300 font-medium">
                          <span>Ref: <strong>{ord.orderId || ord.id}</strong></span>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gold-950/20 text-luxury-gold border border-gold-500/20">{ord.status}</span>
                            <button 
                              onClick={() => returnOrder(ord.orderId || ord.id)}
                              className="px-3 py-1 bg-luxury-gold hover:bg-gold-600 text-luxury-black font-semibold text-[10px] uppercase rounded transition-all"
                            >
                              Request Return
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                          {ord.items.map((i, idx) => {
                            const matchItem = products.find(p => String(p.id) === String(i.productId));
                            return (
                              <div key={idx} className="flex items-center gap-3 justify-between text-slate-400 border-b border-slate-900/50 pb-2">
                                <div className="flex items-center gap-3">
                                  {matchItem?.image && (
                                    <img src={matchItem.image} alt="" className="w-8 h-8 rounded object-cover border border-slate-800" />
                                  )}
                                  <div>
                                    <span className="text-slate-200 block font-medium">{i.name}</span>
                                    <span className="text-[10px] text-slate-500">{i.days || 3} days rental • Qty {i.qty || 1}</span>
                                  </div>
                                </div>
                                <span className="text-slate-200 font-semibold">${i.dailyRent * (i.days || 3) * (i.qty || 1)}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between font-bold text-white pt-2 text-sm">
                          <span>Grand Total Paid</span>
                          <span className="text-luxury-gold">${ord.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Rental History */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-4">
                <h3 className="text-base font-serif text-white">Rental History</h3>
                {returnedRentals.length === 0 ? (
                  <p className="text-xs text-slate-500 font-light py-4">No past rentals recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {returnedRentals.map((ord) => (
                      <div key={ord.id} className="p-4 border border-slate-900 rounded-xl text-xs space-y-3 bg-luxury-dark/40 opacity-80">
                        <div className="flex justify-between items-center text-slate-400 font-medium">
                          <span>Ref: <strong>{ord.orderId || ord.id}</strong></span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-800">{ord.status}</span>
                        </div>
                        
                        <div className="space-y-2">
                          {ord.items.map((i, idx) => {
                            const matchItem = products.find(p => String(p.id) === String(i.productId));
                            return (
                              <div key={idx} className="flex justify-between items-center text-slate-400">
                                <div className="flex items-center gap-2">
                                  {matchItem?.image && (
                                    <img src={matchItem.image} alt="" className="w-6 h-6 rounded object-cover" />
                                  )}
                                  <span>{i.name} (x{i.qty || 1})</span>
                                </div>
                                <span>${i.dailyRent * (i.days || 3) * (i.qty || 1)}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between font-semibold text-slate-300 border-t border-slate-900/60 pt-2">
                          <span>Total Invoiced</span>
                          <span>${ord.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeProfileTab === 'wishlist' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-4 animate-fadeIn">
              <h3 className="text-base font-serif text-white border-b border-slate-900 pb-2">Your Wishlist Vault</h3>
              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-xs text-slate-500 font-light">No masterpieces added to your wishlist yet.</p>
                  <Link to="/collections" className="inline-block text-[10px] font-semibold text-luxury-gold uppercase tracking-wider hover:underline">
                    Browse Collections →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map((p) => (
                    <div key={p.id} className="p-3 border border-slate-800 rounded-xl bg-luxury-charcoal/10 flex gap-3 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-12 h-12 rounded object-cover border border-slate-800" />
                        <div>
                          <h4 className="text-xs font-serif text-white font-medium">{p.name}</h4>
                          <span className="text-[10px] text-luxury-gold">${p.dailyRent}/day</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => addToCart(p, 1)}
                          className="px-2.5 py-1.5 gold-gradient-bg text-luxury-black font-semibold text-[9px] uppercase tracking-wider rounded"
                        >
                          Rent
                        </button>
                        <button 
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1.5 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeProfileTab === 'billing' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-4 animate-fadeIn">
              <h3 className="text-base font-serif text-white border-b border-slate-900 pb-2">Patron Invoice Ledger</h3>
              
              {userOrders.length === 0 ? (
                <p className="text-xs text-slate-500 font-light py-4">No payment transactions recorded.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 text-[10px] uppercase tracking-wider">
                        <th className="pb-3 font-normal">Date</th>
                        <th className="pb-3 font-normal">Invoice ID</th>
                        <th className="pb-3 font-normal">Vault Details</th>
                        <th className="pb-3 font-normal">Paid</th>
                        <th className="pb-3 font-normal">Security Deposit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40 text-slate-300">
                      {userOrders.map((ord) => {
                        const itemsSummary = ord.items.map(i => `${i.name} (x${i.qty || 1})`).join(', ');
                        
                        return (
                          <tr key={ord.id} className="hover:bg-luxury-charcoal/5">
                            <td className="py-3.5 pr-2 whitespace-nowrap text-slate-400 font-light">{ord.date}</td>
                            <td className="py-3.5 pr-2 font-mono font-medium text-white">{ord.orderId || ord.id.substring(0, 8).toUpperCase()}</td>
                            <td className="py-3.5 pr-2 max-w-[180px] truncate font-light text-slate-400" title={itemsSummary}>{itemsSummary}</td>
                            <td className="py-3.5 pr-2 text-white font-semibold">${ord.total}</td>
                            <td className="py-3.5">
                              {ord.status === 'Active' ? (
                                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold bg-gold-950/20 text-luxury-gold border border-gold-500/10">Held (Active Bond)</span>
                              ) : ord.status === 'Returned' ? (
                                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-950/20 text-emerald-400 border border-emerald-500/10">Refunded (Released)</span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold bg-rose-950/20 text-rose-400 border border-rose-500/10">Deducted (Damaged Claim)</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeProfileTab === 'support' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-6 animate-fadeIn">
              <h3 className="text-base font-serif text-white border-b border-slate-900 pb-2">Patron Support Desk</h3>
              
              {tickets.length > 0 && (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-3.5 border border-slate-800 rounded-xl bg-luxury-dark/40 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{t.subject}</span>
                          <span className="text-[8px] font-mono bg-slate-900 px-1.5 py-0.5 text-slate-500 rounded">{t.id}</span>
                        </div>
                        <div className="text-slate-400 font-light mt-1">{t.message}</div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold px-2 py-0.5 rounded bg-gold-950/20 border border-gold-500/10">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSupportSubmit} className="space-y-4 border-t border-slate-900 pt-4 text-left">
                <h4 className="text-xs font-serif text-white uppercase tracking-widest font-semibold">New Support Request</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Subject</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Reschedule pick-up time, Adjust fitment" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                      required 
                      className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Detailed Message</label>
                    <textarea 
                      placeholder="Describe your request..." 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      required 
                      rows="3" 
                      className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                    ></textarea>
                  </div>
                </div>
                <button type="submit" className="px-5 py-2.5 border border-gold-500/20 text-xs text-gold-300 rounded-lg hover:bg-gold-500/10 transition-all cursor-pointer font-semibold uppercase tracking-wider font-semibold uppercase tracking-wider">Submit Ticket</button>
              </form>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        
        {/* Toggle Tabs */}
        <div className="flex bg-luxury-dark/60 p-1.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setLoginType('customer')}
            className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
              loginType === 'customer'
                ? 'bg-gold-500 text-luxury-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
              loginType === 'admin'
                ? 'bg-gold-500 text-luxury-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Login
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-serif text-white">
            {loginType === 'customer' ? 'Client Login' : 'Administrator Lock'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {loginType === 'customer' 
              ? 'Unlock your rentals & client overview' 
              : 'Provide authorization keys to access dashboard panels'}
          </p>
        </div>

        {loginType === 'customer' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Email or Phone Number</label>
              <input 
                type="email" 
                required 
                placeholder="Email address or phone number"
                value={emailOrPhone} 
                onChange={(e) => setEmailOrPhone(e.target.value)} 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Account Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 pr-10 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs focus:outline-none cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="rounded border-slate-800 bg-luxury-charcoal text-gold-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="text-gold-500 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer">Login</button>
          </form>
        ) : (
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Admin ID</label>
              <input 
                type="text" 
                required 
                placeholder="enter the admin id"
                value={adminId} 
                onChange={(e) => setAdminId(e.target.value)} 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Access Password</label>
              <input 
                type="password" 
                required 
                placeholder="enter the access password"
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
              />
            </div>
            <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer">Unlock Dashboard</button>
          </form>
        )}

        {loginType === 'customer' && (
          <div className="text-center text-xs text-slate-500">
            Don't have an account? <Link to="/register" className="text-gold-500 hover:underline font-semibold">Register Here</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
