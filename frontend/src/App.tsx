import { Route, Routes, useHref, useNavigate } from "react-router-dom";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { useEffect } from "react";

import Produtos from "./pages/produtos";
import Clientes from "./pages/clientes";
import Estoque from "./pages/estoque";
import VendasPdv from "./pages/pdv";
import Financas from "./pages/financas";
import Settings from "./pages/settings";
import { ContextProvider } from "./components/contextProvider";
import Login from "./pages/login";
import { useDbStore } from "./store/db-store";
import { useAuthStore } from "./store/auth-store";
import { ProtectedRoute } from "./components/protectRoute";
import Signup from "./pages/signup";
import UserManagement from "./pages/users";

import Home from "@/pages/index";
import Company from "./pages/company";
import { useCompanyInfoStore } from "./store/companyInfo-store";
import ComingSoonPage from "./pages/building";

function App() {
  const navigate = useNavigate();
  const { initDb } = useDbStore();
  const { checkAuth } = useAuthStore();
  const fetchCompany = useCompanyInfoStore((s) => s.fetchCompany);
  
  useEffect(() => {
    const init = async () => {
      await initDb();
      await checkAuth();
      await fetchCompany();
    };

    init();
  }, [initDb, checkAuth, fetchCompany]);

  return (
    <ContextProvider>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <ToastProvider />
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
            path="/"
          />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Produtos />
              </ProtectedRoute>
            }
            path="/produtos"
          />
          <Route
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
            path="/admin/usermanagement"
          />
          <Route
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Clientes />
              </ProtectedRoute>
            }
            path="/clientes"
          />
          <Route
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Estoque />
              </ProtectedRoute>
            }
            path="/estoque"
          />
          <Route
            element={
              <ProtectedRoute allowedTypes={["admin", "user"]}>
                <VendasPdv />
              </ProtectedRoute>
            }
            path="/vendas"
          />
          <Route
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Financas />
              </ProtectedRoute>
            }
            path="/financas"
          />
          <Route element={<Settings />} path="/settings" />
          <Route
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Company />
              </ProtectedRoute>
            }
            path="/company"
          />
          <Route element={<ComingSoonPage />} path="/building" />
        </Routes>
      </HeroUIProvider>
    </ContextProvider>
  );
}

export default App;
