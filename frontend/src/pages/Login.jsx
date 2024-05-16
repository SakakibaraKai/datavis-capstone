import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AuthContext } from '../auth-context';
import{ useContext } from 'react';
import { jwtDecode } from 'jwt-decode'

const Login = () => {
    const { loggedIn, status } = useContext(AuthContext);
    const [failure, setFailure ] = useState(false);

    const [formData, setFormData] = useState({
        "email": "",
        "password": ""
    })


    const [newUser, setNewUser] = useState({
        "name": "",
        "email": "",
        "password": "",
        "is_admin": false
    })


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleNewUserChange = (e) => {
        setNewUser(prevUserData => {

            return {...prevUserData,
                [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
            }
        }
        )
    }

    const handleLogOut = () => {
        status(false)
        localStorage.clear("token")
    }

    const handleNewUser = (e) => {
        e.preventDefault()
        newUser.is_admin = newUser.is_admin ? 1 : 0

        fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(newUser)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setNewUser({
                "name": "",
                "email": "",
                "password": "",
                "is_admin": false
            })
        })
        .catch(error =>  {
            
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('FAILED TO LOGIN');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("token", data.token)
            status(true)
            setFailure(false)
            setFormData({
                "email": "",
                "password": ""
            })
        })
        .catch(error =>  {
            setFailure(true)
        })
    }
    
    if (!loggedIn) {
        return (
            <div className="login-page">
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange}/>
                    {failure && <label className="failure">Login Failed!</label>}
                    <button>Login</button>
                </form>
                <Outlet />
            </div>
        )
    } else {
        const user = jwtDecode(localStorage.getItem("token"))
        return (
            <div className="login-page">
                <h1>Hey, {user.name}</h1>
                {Boolean(user.is_admin) && <h1>Admin Panel</h1>}
                {Boolean(user.is_admin) && <div className="admin-panel"> 
                    <h1>Create a new user</h1>
                    <form className="login-form" onSubmit={handleNewUser}>
                        <label>Name</label>
                        <input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} />
                        <label>Email</label>
                        <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} />
                        <label>Password</label>
                        <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} />
                        <label>Admin Privilege</label>
                        <input type="checkbox" name="is_admin" checked={newUser.is_admin} onChange={handleNewUserChange} />
                        <button>Create User</button>
                    </form>
                </div>}
                <h1 className="logout" onClick={handleLogOut}>Logout</h1>
                <Outlet />
            </div>
        )
    }
}

export default Login