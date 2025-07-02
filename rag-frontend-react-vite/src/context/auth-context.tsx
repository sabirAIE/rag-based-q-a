import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { AccessToken } from "../types";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
};

interface AuthContextType {
  role: string;
  isAdmin: boolean;
  logedIn: boolean;
  setRole: (role: string) => void;
  setLogedIn: (value: boolean) => void;
  user: User;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState("guest");
  const [logedIn, setLogedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decodedToken: AccessToken = jwtDecode(
        localStorage.getItem("token") || ""
      );
      setUser({
        id: decodedToken.userId,
        name: decodedToken.username,
        email: decodedToken.email,
      });
      setRole(decodedToken.role);
      setLogedIn(true);
    } else {
      setRole("guest");
      setLogedIn(false);
      setUser({
        id: "",
        name: "",
        email: "",
      });
    }
  }, [logedIn]);

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === "admin",
        logedIn,
        setRole,
        setLogedIn,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
