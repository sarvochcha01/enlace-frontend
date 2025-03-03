import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { LogType } from "../utils/utils";
import { setAuthInstance } from "../singletons/Auth";

export interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<UserCredential>;
  //   loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading)
      setAuthInstance({
        user,
        loginWithGoogle,
        logout,
        getIdToken,
        loading,
      });
  }, [user]);

  const loginWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    return await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(LogType.Error, error);
    }
  };

  const getIdToken = async (): Promise<string> => {
    if (!user) {
      throw new Error("No user is signed in");
    }

    try {
      return await user.getIdToken();
    } catch (error) {
      console.error(LogType.Error, "Failed to get ID token:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loginWithGoogle, logout, getIdToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
