import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, Outlet, useParams, useRouteError, useLocation } from 'react-router-dom';
import PersonData from './data/people.json'; // bring Data
import { css } from '@emotion/react';
import { AuthContext } from './auth-context';



export function Root () {
    const { loggedIn } = useContext(AuthContext);
    const location = useLocation();
    const currentPath = location.pathname;
    const [activeNav, setActiveNav] = useState(null); 
    const [navClick, setnavClick] = useState(0);
    const [mainClick, setmainClick] = useState(true);
    const handleNavLinkClick = (nav, value) => {
        setmainClick(false);
        setActiveNav(nav);
        setnavClick(value);
    };

    const handlemainClick = () => {
        setmainClick(true);
        setActiveNav(null);
        setnavClick(0);
    }

    return (
        <div style={{ display: 'flex', height:'100%'}}>
            <nav style={{ flex: 'none'}}>
                <ul>
                    <li><NavLink to="/login" onClick={() => handleNavLinkClick("login", 4)} activeclassname="active">{loggedIn ? "Profile" : "Login"}</NavLink></li>
                    <li><NavLink to="/" onClick={() => handlemainClick()}>Product</NavLink></li>
                    <li><NavLink to="/people" onClick={() => handleNavLinkClick("People", 1)} activeslassname="active">People</NavLink></li>
                    <li><NavLink to="/Resources" onClick={() => handleNavLinkClick("Resources", 2)} activeclassname="active">Resources</NavLink></li> 
                    <li><NavLink to="/insert" onClick={() => handleNavLinkClick("CreateTable", 3)} activeclassname="active">Platform</NavLink></li>
                </ul>
            </nav>
            <main style={{height: '100%', width: '80%'}}>
                {currentPath === "/" && <LandingPage />}
                <Outlet />
            </main>
            <sub style={{height: '100%'}}>

            </sub>
        </div>
    )
}

export function People() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [click, setClick] = useState(false);

    const handlepersonbasic = () => {
        setClick(true);
    };

    const endIndex = (itemsPerPage * currentPage) - 1;
    const displayedPeople = Object.keys(PersonData).slice(0, endIndex);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <div style={{ display: 'flex' }}>
            <aside className="aside-container" style={{ flex: 'none' }}>
                <ul className="people-list">
                    {displayedPeople.map(person => (
                        <li key={person} className="people-list-item">
                            <NavLink to={`/people/${person}`} onClick={handlepersonbasic}>{PersonData[person].name}</NavLink>
                        </li>
                    ))}
                    {Object.keys(PersonData).length > endIndex && (
                        <li className="people-list-item">
                            <p onClick={handleNextPage} className="pagination-link">...</p>
                        </li>
                    )}
                </ul>
            </aside>
            <div style={{ flex: '1' }}>
                <Outlet />
            </div>
        </div>
    )
}

export function LandingPage() {
    const { personItem } = useParams();
    const person = PersonData[personItem];


    return (
        <div style={{ display: "flex", height: "100%", width: "100%", justifyContent: "space-between" }}>
            {/* 이미지가 있는 곳 */}
            <div style={{ height: "100%", width: "50%", marginRight: "10px" }}>
                <img src="/BigDataIntro.jpg" alt="BigDataImage" style={{ width: '100%', height: 'auto', margin: '10px' }} />
                <div style ={{width: "100%"}}>
                    <h2>Features</h2>
                    <img src="/Feature2.jpg" alt="Feature1" style={{ width: '100%', height: 'auto' }}/>
                </div>
            </div>
            {/* 설명이 있는 곳 */}
            <div style={{height: "100%", width: "50%",marginLeft: "10px", padding: "10px", boxSizing: "border-box" }}>
                <div style ={{width: "100%"}}>
                    <h2>Product</h2>
                    <ul style={{listStyleType: 'disc'}}>
                        <li style = {{margin: "5px", padding: "1px"}}>We develop our own customized visualization weather platform</li>
                        <li style = {{margin: "5px", padding: "1px"}}>We use the latest weather information to keep our customers updated</li>
                        <li style = {{margin: "5px", padding: "1px"}}>We import Google Map to maintain the familiar experience for customers</li>
                    </ul>
                </div>
                <div style ={{width: "100%"}}>
                    <h2>Why Weather Platform ?</h2>
                    <p>Google Weather does not provide visual weather comparisons between two locations. We use the data provided to not only provide Oregon users with up-to-date data, but we also include a variety of visuals. For your convenience, we imported Google Maps and placed markers in Oregon.</p>
                </div>
                <div style ={{width: "100%"}}>
                    <h2>Who Can Use ?</h2>
                    <p>Targeted at all ages, our platform does not single out customers.</p>
                </div>
                <div>
                    <img src="/Feature1.png" alt="Feature1" style={{ width: '100%', height: 'auto', padding: "10px"}}/>
                </div>
        </div>
    </div>
    );
}

export function Resources() { 

    return (
        <div style={{ display: "flex", height: "100%", width: "100%", justifyContent: "space-between" }}>
            {/* 이미지가 있는 곳 */}
            <div style={{ height: "100%", width: "50%", marginRight: "10px" }}>
                <div style ={{width: "100%"}}>
                    <h2>Download</h2>
                    <p>To be updated later - Currently, we are working on CI/CD after integrating Kubernetes. We will mention the new URL that will be updated.</p>
                    <img src="/BigDataIntro.jpg" alt="BigDataImage" style={{ width: '100%', height: 'auto', margin: '10px' }} />
                </div>
                <div style ={{width: "100%"}}>
                    <h2>Tutorial</h2>
                    <img src="/Feature2.jpg" alt="Feature1" style={{ width: '100%', height: 'auto' }}/>
                </div>
            </div>
            {/* 설명이 있는 곳 */}
            <div style={{height: "100%", width: "50%",marginLeft: "10px", padding: "10px", boxSizing: "border-box" }}>
                <div style ={{width: "100%"}}>
                    <h2>Product</h2>
                    <ul style={{listStyleType: 'disc'}}>
                        <li style = {{margin: "5px", padding: "1px"}}>We develop our own customized visualization weather platform</li>
                        <li style = {{margin: "5px", padding: "1px"}}>We use the latest weather information to keep our customers updated</li>
                        <li style = {{margin: "5px", padding: "1px"}}>We import Google Map to maintain the familiar experience for customers</li>
                    </ul>
                </div>
                <div style ={{width: "100%"}}>
                    <h2>Why Weather Platform ?</h2>
                    <p>Google Weather does not provide visual weather comparisons between two locations. We use the data provided to not only provide Oregon users with up-to-date data, but we also include a variety of visuals. For your convenience, we imported Google Maps and placed markers in Oregon.</p>
                </div>
                <div style ={{width: "100%"}}>
                    <h2>Who Can Use ?</h2>
                    <p>Targeted at all ages, our platform does not single out customers.</p>
                </div>
                <div>
                    <img src="/Feature1.png" alt="Feature1" style={{ width: '100%', height: 'auto', padding: "10px"}}/>
                </div>
            </div>
        </div>
    );
}


export function ErrorPage() {
    const error = useRouteError();
    console.error(error);
    
    return (
        <>
            <h1>Error</h1>
            <p>404 {error.statusText || error.message}</p>
        </>
    );
}