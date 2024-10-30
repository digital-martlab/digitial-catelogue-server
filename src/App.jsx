
import { Route, Routes } from 'react-router-dom';
import RequireAuth from "./components/RequiredAuth";
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './context/theme-context';
import { protectedRoutes } from "./lib/routes";
import AdminLogin from "./pages/admin/admin-login";
import StoreProductListing from "./pages/store/store-product-listing";
import SuperAdminLogin from './pages/super-admin/super-admin-login';
import Home from './pages/Home';
import PanelNavigationIfAuth from './components/navigate-to-panel-if-auth';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PanelNavigationIfAuth />} >
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
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
      <Toaster />
    </ThemeProvider>
  );
}
