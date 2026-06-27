import React, { useState, useMemo } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const { login, logout, user, orders, tickets, addTicket, updateUserProfile, adminCredentials } = useLuxe();
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
 
  // Support ticket form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
 
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
      address: editAddress
    });
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditAddress(user.address || '');
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
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Profile overview & Edit */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl space-y-4">
          <div className="text-center space-y-2">
            <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto border-2 border-gold-500" alt="" />
            <div>
              <h2 className="text-xl font-serif text-white">{user.name}</h2>
              <p className="text-[10px] text-luxury-gold uppercase tracking-widest">Luxe Member</p>
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="text-left text-xs text-slate-400 space-y-2.5">
                <div><span className="text-slate-500 block text-[10px] uppercase tracking-wider">Email Address</span> <strong className="text-white font-normal">{user.email}</strong></div>
                <div><span className="text-slate-500 block text-[10px] uppercase tracking-wider">Phone Contact</span> <strong className="text-white font-normal">{user.phone}</strong></div>
                <div><span className="text-slate-500 block text-[10px] uppercase tracking-wider">Shipping Address</span> <strong className="text-white font-normal">{user.address}</strong></div>
              </div>
              {user.hasAdminAccess && (
                <Link 
                  to="/admin" 
                  className="block w-full py-2.5 text-center bg-gold-500 text-luxury-black font-bold text-xs uppercase tracking-widest rounded shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Enter Admin Panel
                </Link>
              )}
              <button 
                onClick={startEditing} 
                className="w-full py-2 bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-semibold rounded uppercase tracking-wider hover:bg-gold-500/20 transition-all cursor-pointer"
              >
                Edit Information
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4 border-t border-slate-800 text-left">
              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Phone Contact</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Shipping Address</label>
                <textarea 
                  value={editAddress} 
                  onChange={(e) => setEditAddress(e.target.value)} 
                  rows="2"
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 gold-gradient-bg text-luxury-black font-semibold text-xs rounded uppercase tracking-wider">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 border border-slate-800 text-slate-400 text-xs rounded uppercase tracking-wider">Cancel</button>
              </div>
            </form>
          )}

          <button onClick={logout} className="w-full py-2 bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded uppercase tracking-wider hover:bg-rose-900/10 cursor-pointer">Logout</button>
        </div>

        {/* Right Side: Orders and Support Tickets */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Bookings */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Active Vault Rentals</h3>
            {activeRentals.length === 0 ? (
              <p className="text-xs text-slate-500 font-light py-2">No active rentals currently booked.</p>
            ) : (
              <div className="space-y-4">
                {activeRentals.map((ord) => (
                  <div key={ord.id} className="p-4 border border-slate-800 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-300 font-medium">
                      <span>Order Reference: <strong>{ord.id}</strong></span>
                      <span className="px-2 py-0.5 rounded bg-gold-950/20 text-luxury-gold border border-gold-500/20">{ord.status}</span>
                    </div>
                    <div className="text-slate-500">Date Placed: {ord.date}</div>
                    <div className="space-y-1">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-slate-400">
                          <span>{i.name} (x{i.qty || 1}) - {i.days || 3} days</span>
                          <span>${i.dailyRent * (i.days || 3) * (i.qty || 1)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-slate-900 pt-2 text-sm">
                      <span>Total Invoice</span>
                      <span>${ord.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Rental History */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Rental History</h3>
            {returnedRentals.length === 0 ? (
              <p className="text-xs text-slate-500 font-light py-2">No past rentals recorded.</p>
            ) : (
              <div className="space-y-4">
                {returnedRentals.map((ord) => (
                  <div key={ord.id} className="p-4 border border-slate-800 rounded-lg text-xs space-y-2 opacity-75">
                    <div className="flex justify-between items-center text-slate-400 font-medium">
                      <span>Order Reference: <strong>{ord.id}</strong></span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">{ord.status}</span>
                    </div>
                    <div className="text-slate-500">Date Returned: {ord.date}</div>
                    <div className="space-y-1">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-slate-400">
                          <span>{i.name} (x{i.qty || 1}) - {i.days || 3} days</span>
                          <span>${i.dailyRent * (i.days || 3) * (i.qty || 1)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-slate-900 pt-2 text-sm">
                      <span>Total Returned Invoice</span>
                      <span>${ord.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Support Tickets Section */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Support Tickets</h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 border border-slate-800 rounded bg-luxury-dark/40 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-white">{t.subject}</div>
                    <div className="text-slate-500">{t.message}</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{t.status}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3 border-t border-slate-900 pt-4 text-left">
              <h4 className="text-xs font-serif text-white uppercase tracking-widest">New Support Request</h4>
              <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
              <textarea placeholder="Describe your request..." value={message} onChange={(e) => setMessage(e.target.value)} required rows="2" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"></textarea>
              <button type="submit" className="px-4 py-2 border border-gold-500/30 text-xs text-gold-300 rounded hover:bg-gold-500/10 cursor-pointer">Submit Ticket</button>
            </form>
          </div>

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
                type="text" 
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
