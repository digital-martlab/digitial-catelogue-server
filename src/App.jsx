import { ThemeProvider } from "@/components/theme-provider";
import { Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { default as AdminLayout } from './layouts/admin-layout';
import { protectedRoutes } from "./lib/routes";
import SuperAdminLogin from './pages/super-admin/super-admin-login';
import RequireAuth from "./components/RequiredAuth";
import AdminLogin from "./pages/admin/admin-login";
import SelectedImages from "./components/custom-select-images";
import UploadImages from "./components/custom-upload-images";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

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
      <SelectedImages />
      <UploadImages />
    </ThemeProvider>
  );
}
