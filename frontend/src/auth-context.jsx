import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const checkTokenValidity = () => { 
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        fetch("http://localhost:8080/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }).then(response => {
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            return false;
        });

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