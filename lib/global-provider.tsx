import React, { createContext, useContext, ReactNode } from "react";

import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";
import { UserProfileType, UserRoleType } from "@/types";

interface GlobalContextType {
    isLogged: boolean;
    isOnboarded: boolean;
    user: User | null;
    loading: boolean;
    refetch: (d?: any) => void;
}

interface User {
    $id: string;
    user_id: string;
    name: string;
    email: string;
    avatar: string;
    isOnboarded: boolean;
    role: UserRoleType;
    profile: UserProfileType;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const {
        data: user,
        loading,
        refetch,
    } = useAppwrite({
        fn: getCurrentUser,
    });

    const isLogged = !!user;
    const isOnboarded = user?.isOnboarded;

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                isOnboarded,
                user,
                loading,
                refetch,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context)
        throw new Error("useGlobalContext must be used within a GlobalProvider");

    return context;
};

export default GlobalProvider;