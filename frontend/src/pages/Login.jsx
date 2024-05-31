import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AuthContext } from '../auth-context';
import{ useContext } from 'react';
import { jwtDecode } from 'jwt-decode'
import styled from '@emotion/styled'
import Spinner from '../components/Spinner.jsx'
import ErrorContainer from '../components/ErrorContainer.jsx'

// 버튼 스타일 정의
const ButtonStyle = styled.input`
    margin-bottom: 10px;
    width: 30vw;    // vw: 가로 너비가 줄어들게 함
    height: 3vh;    
    border-radius: 20px;
    text-align: center;  // 텍스트 관련요소
    cursor: pointer; // 마우스 커서가 포인터로 변경
`;

const Loading = styled.div`
  align-items: center;
  flex-direction: column;
`

const Login = () => {
    const { loggedIn, status } = useContext(AuthContext);
    const [failure, setFailure ] = useState(false);
    const [createfailure, setCreateFailure] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

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
``
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

        //check if the user is empty strings
        if (newUser.name === "" || newUser.email === "" || newUser.password === "") {
            setCreateFailure(true)
            return
        }

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
            setCreateFailure(false)
            setCreateSuccess(true)
            setTimeout(() => {
                setCreateSuccess(false)
            }, 5000)
        })
        .catch(error =>  {
            setCreateFailure(true)
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

    const handleRainRequest = () => {
        setLoading(true)
        fetch('http://localhost:8080/rain')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setLoading(false)
                alert('Rain data requested successfully');
            })
            .catch(error => {
                console.error('There was an error requesting the rain data!', error);
                alert('Failed to request rain data');
            });
    };
    
    const handleUpdateDatabaseRequest = async() => {
        setLoading(true)
        const controller = new AbortController();
        try {
            const response = await fetch('http://localhost:8080/update-database', {
                method: 'GET',
                signal: controller.signal
            })
            const res = await response.json();
            setLoading(false)
        }catch(error) {
            console.error("Update error", error);
        }finally {
            alert('Database updated successfully');
        }
    };
    
    if (!loggedIn) {
        return (
            <div className="login-page">
                <h1>Login</h1>
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
    } else if (loggedIn){
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
                        {createfailure && <label className="failure">Failed to create user!</label>}
                        {createSuccess && <label className="success">Success!</label>}
                        <button>Create User</button>
                    </form>

                </div>}
                <h1 className="logout" onClick={handleLogOut}>Logout</h1>
                {Boolean(user.is_admin) && 
                            <div>
                            <ButtonStyle 
                                type="button" 
                                value="Request Graphs" 
                                onClick={handleRainRequest} 
                            />
                            <ButtonStyle 
                                type="button" 
                                value="Update Database" 
                                onClick={handleUpdateDatabaseRequest} 
                            />
                        </div>
                
                }
                <Loading>
                    {error && <ErrorContainer />}
                    {loading && <Spinner />}
                </Loading>
                <Outlet />
            </div>
        )
    }
}

export default Login