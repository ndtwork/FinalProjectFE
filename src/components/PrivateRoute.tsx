// src/components/PrivateRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { token } = useAuth();
  // nếu chưa có token, chuyển về trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // ngược lại render children bình thường
  return <>{children}</>;
}
