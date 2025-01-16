import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
    username: string;
    setUsername: (name: string) => void;
    clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState('');

    const clearUser = () => {
        setUsername('');
    };

    return (
        <UserContext.Provider value={{ username, setUsername, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
