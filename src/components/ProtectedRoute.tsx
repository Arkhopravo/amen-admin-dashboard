// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import { getSession } from "@/api/auth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;

  // If error or no valid user object
  if (isError || !data || !data._id) {
    return <Navigate to="/login" />;
  }

  // Redirect non-admin users
  if (data.role !== "admin") {
    window.location.href = "http://localhost:3000";
    return null;
  }

  return <>{children}</>;
};
