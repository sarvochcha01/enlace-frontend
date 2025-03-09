import axios from "axios";
import { User } from "firebase/auth";
import { baseUrl, LogType } from "../utils/utils";
import { getIdToken } from "../singletons/Auth";

export class UserService {
  static async CreateUser(user: User) {
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

      console.log(LogType.Log, response?.data);
    } catch (backendError) {
      console.error(LogType.Error, backendError);
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
}
