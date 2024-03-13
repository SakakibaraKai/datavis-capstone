import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, Outlet, useParams, useRouteError, useLocation } from 'react-router-dom';
import PersonData from './data/people.json'; // bring Data

export function Root() {
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
        <>
            <nav>
                <ul>
                    <li><NavLink to="/" onClick={() => handlemainClick()}>main</NavLink></li>
                    <li><NavLink to="/people" onClick={() => handleNavLinkClick("People", 1)} className={activeNav === "People" ? "active" : ""}>People</NavLink></li>
                    <li><NavLink to="/fetchapi" onClick={() => handleNavLinkClick("fetchapi", 2)} className={activeNav === "FetchApi" ? "active" : ""}>FetchApi</NavLink></li>
                    <li><NavLink to="/login" onClick={() => handleNavLinkClick("login", 4)} className={activeNav === "Login" ? "active" : ""}>Login</NavLink></li>
                    <li><NavLink to="/insert" onClick={() => handleNavLinkClick("CreateTable", 3)} className={activeNav === "CreateTable" ? "active" : ""}>Insert</NavLink></li>
                    <li><NavLink to="/display" onClick={() => handleNavLinkClick("DisplayTable", 5)} className={activeNav === "DisplayTable" ? "active" : ""}>Display</NavLink></li>

                </ul>
            </nav>
            <main>
                <Outlet />
                {mainClick && <Main />}
            </main>
        </>
    )
}

export function Main() {
    return (
        <div>
            <h2> This is Frontend on our Project</h2>
        </div>
    );
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

export function PersonItem() {
    const { personItem } = useParams();
    const person = PersonData[personItem];

    if (!person) {
        return <div>
                <h2>Person not found</h2>
            </div>;
    }

    return (
        <div>
            <h2>{person.name}</h2>
            <p>Height: {person.height}</p>
            <p>Mass: {person.mass}</p>
            <p>Gender: {person.gender}</p>
        </div>
    );
}

export function PersonBasic() {
    return (
        <div>
            <h2>This Navigation is for Person Item</h2>
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