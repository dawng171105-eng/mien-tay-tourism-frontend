import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CookieConsent from "./components/CookieConsent";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalSearch, { useGlobalSearch } from "./components/GlobalSearch";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Guide from "./pages/Guide";
import GuideDetail from "./pages/GuideDetail";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import AIPlanner from "./pages/AIPlanner";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Policies from "./pages/Policies";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminTours from "./pages/admin/AdminTours";
import AdminBookings from "./pages/admin/AdminBookings";
import Revenue from "./pages/admin/Revenue";

function AppContent() {
  const { isOpen, closeSearch } = useGlobalSearch();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <GlobalSearch isOpen={isOpen} onClose={closeSearch} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/:id" element={<GuideDetail />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Policies />} />
          <Route path="/privacy" element={<Policies />} />
          <Route path="/cancellation" element={<Policies />} />
          <Route path="/payment" element={<Policies />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute role="customer">
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="revenue" element={<Revenue />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
