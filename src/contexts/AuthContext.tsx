import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface User {
  _id: Id<"users">;
  email: string;
  name: string;
  createdAt: number;
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

const TOKEN_KEY = 'inkwell_token';

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

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
      if (user === null && token) {
        // Token is invalid, clear it
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
    }
  }, [user, token]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInMutation({ email, password });
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await signUpMutation({ email, password, name });
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    if (token) {
      try {
        await signOutMutation({ token });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
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
