import React from 'react';
import AppNavigator from './navigation';
import { UserProvider } from './context/userContext';

export default function App() {
    return (
        <UserProvider>
            <AppNavigator />
        </UserProvider>
    );
}
