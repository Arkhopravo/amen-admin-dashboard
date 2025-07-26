
import axios from "axios";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profilePicture: string;
  savedCourses: string[];
  savedPosts: string[];
  mobile_no: string;
  desc: string;
}


export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
   withCredentials: true, // Include cookies in the request
  });
    if (res.status !== 200) {
        throw new Error("Failed to fetch users");
    } 
    localStorage.setItem("profilePicture", JSON.stringify(res.data.profilePicture));
//   console.log( localStorage.getItem("token"))
  return res.data;
};



