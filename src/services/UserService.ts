import axios from "axios";
import { getIdToken } from "../singletons/Auth";
import { User } from "../models/dtos/User";
import { User as FirebaseUser } from "firebase/auth";
import { baseUrl } from "../utils/utils";

export class UserService {
  static async CreateUser(user: FirebaseUser) {
    const payload = {
      firebaseUID: user.uid,
      name: user.displayName,
      email: user.email,
    };

    try {
      const response = await axios.post(`${baseUrl}/users/create`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response || response.status !== 201) {
        throw new Error("Backend user creation failed");
      }

      console.log(response?.data);
    } catch (backendError) {
      console.error(backendError);
      // Delete Firebase user if backend request fails
      await user.delete();
      console.error("Backend user creation failed. Firebase user deleted.");
      return;
    }
  }

  static GetUser = async () => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.get(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  };

  static SearchUser = async (value: string): Promise<User[]> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    try {
      const res = await axios.post<User[]>(
        `${baseUrl}/users/search`,
        { query: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error searching user:", error);
      throw error;
    }
  };
}
