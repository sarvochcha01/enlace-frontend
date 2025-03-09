import { createContext, useState } from "react";
import { User } from "../models/dtos/User";

export interface UserContextType {
  dbUser: User | null;
  setDBUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [dbUser, setDBUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ dbUser, setDBUser }}>
      {children}
    </UserContext.Provider>
  );
};
