import axios from "axios";
import { getIdToken } from "../singletons/Auth";
import { baseUrl } from "../utils/utils";

export class DashboardService {
    static getRecentlyAssignedTasks = async (limit: number) => {
        const token = await getIdToken();
        if (!token) {
            throw new Error("No authentication token available. Please log in.");
        }

        const res = await axios.get(`${baseUrl}/dashboard/recently-assigned?limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    };

    static getInProgressTasks = async (limit: number) => {
        const token = await getIdToken();
        if (!token) {
            throw new Error("No authentication token available. Please log in.");
        }

        const res = await axios.get(`${baseUrl}/dashboard/in-progress?limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    };

    static getApproachingDeadlineTasks = async (limit: number) => {
        const token = await getIdToken();
        if (!token) {
            throw new Error("No authentication token available. Please log in.");
        }

        const res = await axios.get(`${baseUrl}/dashboard/approaching-deadline?limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    };

    static search = async (query: string) => {
        const token = await getIdToken();
        if (!token) {
            throw new Error("No authentication token available. Please log in.");
        }

        const res = await axios.get(`${baseUrl}/dashboard/search?query=${encodeURIComponent(query)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Search results:", res.data);
        return res.data;
    }
}
