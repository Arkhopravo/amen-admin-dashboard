
import axios from "axios";

// types/user.ts
export interface AllUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  mobile_no: string;
  profilePicture: string;
}


// services/user.ts or api.ts
export const getAllUsers = async (): Promise<AllUser[]> => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
    withCredentials: true, // Include cookies in the request
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch all users");
  }

  return res.data; // ✅ return only the array
};
