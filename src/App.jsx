
import { Route, Routes } from 'react-router-dom';
import PanelNavigationIfAuth from './components/navigate-to-panel-if-auth';
import RequireAuth from "./components/RequiredAuth";
import { protectedRoutes } from "./lib/routes";
import AdminLogin from "./pages/admin/admin-login";
import ResetPasswordAdmin from './pages/admin/reset-password';
import Home from './pages/Home';
import StoreProductListing from "./pages/store/store-product-listing";
import SuperAdminLogin from './pages/super-admin/super-admin-login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<PanelNavigationIfAuth />} >
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/admin/reset-password/:token" element={<ResetPasswordAdmin />} />
      </Route>

      <Route path="/store/:store_slug" element={<StoreProductListing />} />
      {protectedRoutes.map(route => (
        <Route
          key={route._id}
          element={<RequireAuth allowedRoles={route.assignedRoles} />}
        >
          <Route path={route.link} element={route.element} />
        </Route>
      ))}
    </Routes>
  );
}
