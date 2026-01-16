import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface User {
  _id: Id<"users">;
  email: string;
  name: string;
  createdAt: number;
  hasActiveSubscription: boolean;
  subscriptionId?: string;
  subscriptionStatus?: string;
  aiGlobalInstructions?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'writewell_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState(true);

  const signInMutation = useMutation(api.auth.signIn);
  const signUpMutation = useMutation(api.auth.signUp);
  const signOutMutation = useMutation(api.auth.signOut);

  const user = useQuery(
    api.auth.getCurrentUser,
    token ? { token } : 'skip'
  );

  // 🔑 This effect FINALIZES auth loading
  useEffect(() => {
    // No token → auth resolved
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Query resolved (either user or null)
    if (user !== undefined) {
      if (user === null) {
        // Invalid token
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
      setIsLoading(false);
    }
  }, [user, token]);

  const signIn = async (email: string, password: string) => {
    const result = await signInMutation({ email, password });
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setIsLoading(true); // restart auth resolution
  };

  const signUp = async (email: string, password: string, name: string) => {
    const result = await signUpMutation({ email, password, name });
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setIsLoading(true); // restart auth resolution
  };

  const signOut = async () => {
    if (token) {
      try {
        await signOutMutation({ token });
      } catch {}
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        token,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
