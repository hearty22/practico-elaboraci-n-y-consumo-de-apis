import { createContext, useState, useEffect } from "react";
import { verifyAuth } from "../api/api";

// Define the shape of the User object
interface User {
  id: string;
  username: string;
  email: string;
}

// Define the shape of the context data
export interface AuthContextType {
  isAuth: boolean;
  user: User | null;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  // We keep the setters for flexibility, though they might not be used directly
  setIsAuth: (isAuth: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}
//create and export the context. the hook will need it.
//eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

// The useAuth hook has been moved to its own file.

// Create the Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await verifyAuth();
      if (response && response.ok && response.data.user) {
        setUser(response.data.user);
        setIsAuth(true);
      } else {
        setIsAuth(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuth(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isLoading,
        checkAuthStatus,
        setUser,
        setIsAuth,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
