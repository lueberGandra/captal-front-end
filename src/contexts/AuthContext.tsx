import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { cookieService } from "@/services/cookieService";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = cookieService.getCookie("accessToken");
    if (accessToken) {
      setIsAuthenticated(true);
      setToken(accessToken);
    }
  }, []);

  const setAuth = (token: string) => {
    setIsAuthenticated(true);
    setToken(token);
  };

  const clearAuth = () => {
    cookieService.clearAllAuthCookies();
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, setAuth, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
