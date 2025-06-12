import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential,
  getAdditionalUserInfo,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { setAuthInstance } from "../singletons/Auth";
import { UserService } from "../services/UserService";

export interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signupWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<UserCredential>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

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
        loginWithEmail,
        signupWithEmail,
        logout,
        getIdToken,
        loading,
      });
  }, [user]);

  const loginWithGoogle = async (): Promise<UserCredential> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);

      const additionalUserInfo = getAdditionalUserInfo(result);
      if (additionalUserInfo?.isNewUser) {
        try {
          await UserService.CreateUser(result.user);
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
      }

      return result;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const signupWithEmail = async (
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user && name.trim()) {
        await updateProfile(userCredential.user, {
          displayName: name.trim(),
        });
      }

      try {
        await UserService.CreateUser(userCredential.user);
      } catch (error) {
        console.error("Error creating user profile:", error);
      }

      return userCredential;
    } catch (error) {
      console.error("Email signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const getIdToken = async (): Promise<string> => {
    if (!user) {
      throw new Error("No user is signed in");
    }
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Failed to get ID token:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        getIdToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
