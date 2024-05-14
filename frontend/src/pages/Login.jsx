import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AuthContext } from '../auth-context';
import{ useContext } from 'react';

const Login = () => {
    const { loggedIn, status } = useContext(AuthContext);
    const [failure, setFailure ] = useState(false);

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
        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("token", data.token)
            status(true)
        })
        .catch(error =>  {
            setFailure(true)
            console.log("error")
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
        return (
            <div className="login-page">
                <h1>Hey, </h1>
                <h1 className="logout" onClick={handleLogOut}>Logout</h1>
                <Outlet />
            </div>
        )
    }
}

export default Login