import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AuthContext } from '../auth-context';
import{ useContext } from 'react';
import { jwtDecode } from 'jwt-decode'

const Login = () => {
    const { loggedIn, status } = useContext(AuthContext);
    const [failure, setFailure ] = useState(false);
    const [user, setUser] = useState({});

    const [formData, setFormData] = useState({
        "email": "",
        "password": ""
    })

    function handleCallbackResponse (response) {
        localStorage.setItem("token", response.credential)
        status(true)
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleLogOut = () => {
        status(false)
        localStorage.clear("token")
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

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "523569965084-k65jdc3qu1n9ptqn4ghlo1cmrrams16n.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("google-login"),
            {theme: "outline", size: "large"}
        )

    }, [])

    
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
                <p>or Sign in with Google</p>
                <div id="google-login"></div>
                <Outlet />
            </div>
        )
    } else {
        const user = jwtDecode(localStorage.getItem("token"))
        return (
            <div className="login-page">
                <h1>Hey, {user.name}</h1>
                <h1 className="logout" onClick={handleLogOut}>Logout</h1>
                <Outlet />
            </div>
        )
    }
}

export default Login