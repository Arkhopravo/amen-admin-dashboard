

 // src/api/auth.ts
export const getSession = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
    credentials: "include", // sends the httpOnly cookie
  });

  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
};
