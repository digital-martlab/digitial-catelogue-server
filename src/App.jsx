import { ThemeProvider } from "@/components/theme-provider";
import { Route, Routes } from 'react-router-dom';
import AdminLogin from './components/login';
import { Toaster } from './components/ui/toaster';
import { default as AdminLayout } from './layouts/admin-layout';
import { protectedRoutes } from "./lib/routes";
import SuperAdminLogin from './pages/super-admin/super-admin-login';
import RequireAuth from "./components/RequiredAuth";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

        <Route element={<AdminLayout />}>
          {protectedRoutes.map(route => (
            <Route
              key={route._id}
              path={route.link}
              element={<RequireAuth allowedRoles={route.assignedRoles} />}
            >
              <Route element={route.element} />
            </Route>
          ))}
        </Route>
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}
