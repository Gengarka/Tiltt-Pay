import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import { ServicePage } from './pages/ServicePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;