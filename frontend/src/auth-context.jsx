import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token);
        }
    }, []);

    const validateToken = (token) => {
        fetch("http://localhost:8080/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        .then(response => {
            if (response.ok) {
                setLoggedIn(true);
                console.log("Token is valid");
            } else {
                setLoggedIn(false);
                console.log("Token is invalid");
            }
        })
        .catch(error => {
            console.log("Error validating token:", error);
            setLoggedIn(false);
        });
    };


    const status = loginStatus => {
        setLoggedIn(loginStatus);
    };


    return (
        <AuthContext.Provider value={{ loggedIn, status }}>
            {children}
        </AuthContext.Provider>
    );
};