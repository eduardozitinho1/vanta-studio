import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/CollectionDetail';
import Search from '@/pages/Search';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Shipping from '@/pages/Shipping';
import NotFound from '@/pages/NotFound';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminProductForm from '@/pages/admin/AdminProductForm';
import AdminCollections from '@/pages/admin/AdminCollections';
import AdminOrders from '@/pages/admin/AdminOrders';
import { RequireAdmin } from '@/pages/admin/RequireAdmin';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/loja" element={<Shop />} />
              <Route path="/produto/:slug" element={<ProductDetail />} />
              <Route path="/colecoes" element={<Collections />} />
              <Route path="/colecoes/:slug" element={<CollectionDetail />} />
              <Route path="/busca" element={<Search />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido/:id" element={<OrderConfirmation />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/envio-e-devolucoes" element={<Shipping />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<Navigate to="painel" replace />} />
              <Route path="painel" element={<AdminDashboard />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="produtos/novo" element={<AdminProductForm mode="create" />} />
              <Route path="produtos/:id" element={<AdminProductForm mode="edit" />} />
              <Route path="colecoes" element={<AdminCollections />} />
              <Route path="pedidos" element={<AdminOrders />} />
            </Route>
          </Routes>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
