import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const {isLoggedIn, setIsLoggedIn, userName, setUserName} = useAppContext();

    const navigate = useNavigate();
    useEffect(()=>{
        const authTokenFromSession = sessionStorage.getItem("auth-token");
        const nameFromSession = sessionStorage.getItem("name");
        if(authTokenFromSession){
            if(isLoggedIn && nameFromSession){
                setUserName(nameFromSession);
            } else {
                sessionStorage.removeItem("auth-token");
                sessionStorage.removeItem("name");
                sessionStorage.removeItem("email"); 
                setIsLoggedIn(false);
            }
        }

    }, [isLoggedIn, setIsLoggedIn, setUserName]);

    //handle logout
    const handleLogout = ()=>{
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email"); 
        setIsLoggedIn(false);
        navigate("/app");
    };

    const profileSection = ()=>{
        navigate("/app/profile");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">GiftLink</a>
            
            {/*Navbar links to home page and gifts*/}
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href='/home.html' >Home</a>

                    </li>
                    <li>
                        <a className="nav-link" href="/app">Gifts</a>
                    </li>
                     <li>
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>
                    <ul className='navbar-nav ml-auto'>
                        {isLoggedIn ?(
                            <>
                                <li className='nav-item'>Welcome <span className='nav-link' style={{color: "black", cursor: "pointer"}} onClick={profileSection}> {userName} </span></li>
                                <li className='nav-item'><button className='nav-link login-btn' onClick={handleLogout}>Logout</button></li>
                            </>
                        ):(<>
                        </>)}

                    </ul>
                </ul>
            </div>
        </nav>
    );
}
