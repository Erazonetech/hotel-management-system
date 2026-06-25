import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import WaiterPanel from './pages/WaiterPanel';
import OrderStatus from './pages/OrderStatus';
import ProtectedRoute from './components/common/ProtectedRoute';
import About from './pages/About';
import Contact from './pages/Contact';
import Reservations from './pages/Reservations';
import CashierPanel from './pages/CashierPanel';
import KitchenPanel from './pages/KitchenPanel';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SocketProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrderStatus />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/waiter" element={
                    <ProtectedRoute requiredRole="waiter">
                      <WaiterPanel />
                    </ProtectedRoute>
                  } />
                  <Route path="/cashier" element={
                    <ProtectedRoute requiredRole="cashier">
                      <CashierPanel />
                    </ProtectedRoute>
                                      } />
                    <Route path="/kitchen" element={
                      <ProtectedRoute requiredRole="kitchen">
                        <KitchenPanel />
                      </ProtectedRoute>
                    } />
                  <Route path="/about" element={<About/>} />
                  <Route path="/contact" element={<Contact/>} />
                  <Route path="/reservations" element={<Reservations />} />

                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" />
          </SocketProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;