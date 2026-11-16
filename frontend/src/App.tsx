import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import { ServicePage } from './pages/ServicePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { WalletPage } from './pages/WalletPage';
import { SettingsPage } from './pages/SettingPage';
import { MyServicesPage } from './pages/MyServicePage';
import { ServiceFormPage } from './pages/ServiceFormPage';
import { AdminPage } from './pages/AdminPage';
import { SupportPage } from './pages/SupportPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/my-services" element={<MyServicesPage />} />
          <Route path="/my-services/new" element={<ServiceFormPage />} />
          <Route path="/my-services/edit/:id" element={<ServiceFormPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;