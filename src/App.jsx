import { ThemeProvider } from "@/components/theme-provider";
import { Route, Routes } from 'react-router-dom';
import RequireAuth from "./components/RequiredAuth";
import { Toaster } from './components/ui/toaster';
import { default as AdminLayout } from './layouts/admin-layout';
import { protectedRoutes } from "./lib/routes";
import AdminLogin from "./pages/admin/admin-login";
import StoreProductListing from "./pages/store/store-product-listing";
import SuperAdminLogin from './pages/super-admin/super-admin-login';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/store/:store_slug" element={<StoreProductListing />} />

        <Route element={<AdminLayout />}>
          {protectedRoutes.map(route => (
            <Route
              key={route._id}
              element={<RequireAuth allowedRoles={route.assignedRoles} />}
            >
              <Route path={route.link} element={route.element} />
            </Route>
          ))}
        </Route>
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}
