import { AuthContextType } from "../context/AuthContext";

let authInstance: AuthContextType | undefined = undefined;

export const setAuthInstance = (instance: AuthContextType) => {
  authInstance = instance;
};

export const getIdToken = async (): Promise<string> => {
  while (!authInstance) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
  }

  return await authInstance.getIdToken();
};
