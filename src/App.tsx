import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SignUp from "@/pages/SignUp";
import Projects from "@/pages/Projects";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/projects"
        element={isAuthenticated ? <Projects /> : <Navigate to="/login" />}
      />
      <Route
        path="/about"
        element={isAuthenticated ? <About /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
