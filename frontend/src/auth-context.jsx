import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const checkTokenValidity = () => { 
        //make a request to the validtoken endpoint to check if the token is valid
        //make a test token
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        try {
            const response =  fetch('http://localhost:8000/validtoken', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    const [loggedIn, setLoggedIn] = useState(checkTokenValidity());

    const status = loginStatus => {
        setLoggedIn(loginStatus);
    };


    return (
        <AuthContext.Provider value={{ loggedIn, status }}>
            {children}
        </AuthContext.Provider>
    );
};