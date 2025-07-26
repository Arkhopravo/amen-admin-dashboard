
import axios from "axios";

export interface User {
  updatedAt: string | number | Date;
  createdAt: string | number | Date;
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


export const getUserById = async (id: any): Promise<User[]> => {
  // TODO: Implement this function to fetch user by ID
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/users/${id}`, {
    withCredentials: true
  })

  if(res.status !== 200) {
    throw new Error("Failed to fetch user")
  }
  return res.data;
}


export const updateUser = async (userId: any, data: { username: string; email: string; mobile_no: string; role: "admin" | "student" | "staff"; desc?: string | undefined; password?: string | undefined; confirmPassword?: string | undefined; }): Promise<User[]> => {
  const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${userId}`, {
    withCredentials: true
  })
  return res.data;
}