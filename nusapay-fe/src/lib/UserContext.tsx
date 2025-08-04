"use client";
import { getMe } from "@/utils/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
// import {jwtDecode} from "jwt-decode";

type UserInfo = {
  _id: string;
  email: string;
  companyId : string;
  companyName : string;
};

export const useUser = () => useContext(UserContext);

type UserContextType = {
  user: UserInfo | null;
  loading: boolean;
};  

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true); // 🆕 Loading state

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await getMe();
        console.log(userData);
        setUser(userData);
      } catch (error) {
        console.error("User not logged in or session expired: ", error);
      } finally {
        setLoading(false); // 🆕 Jangan lupa
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
