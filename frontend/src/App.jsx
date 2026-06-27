import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Collections from './pages/Collections.jsx';
import CulturalJewelry from './pages/CulturalJewelry.jsx';
import WeddingJewelry from './pages/WeddingJewelry.jsx';
import Festivals from './pages/Festivals.jsx';
import RentalCalculator from './pages/RentalCalculator.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import OtpVerification from './pages/OtpVerification.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Contact from './pages/Contact.jsx';
import Faqs from './pages/Faqs.jsx';
import Blog from './pages/Blog.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';


import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="min-h-screen bg-luxury-black text-slate-100 flex flex-col font-sans">
        {/* Navigation Header */}
        <Header />

        {/* Dynamic Route Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:categoryName" element={<Collections />} />
            
            <Route path="/wedding" element={<WeddingJewelry />} />
            <Route path="/wedding/:occasionName" element={<WeddingJewelry />} />
            
            <Route path="/cultural" element={<CulturalJewelry />} />
            <Route path="/cultural/:cultureName" element={<CulturalJewelry />} />
            
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/festivals/:festivalName" element={<Festivals />} />

            <Route path="/calculator" element={<RentalCalculator />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faqs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

        </main>

        {/* Brand Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
