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
        console.log({nameFromSession});
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

    }, [isLoggedIn, setIsLoggedIn, userName, setUserName]);

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
            <a className="navbar-brand mx-3" href="/">GiftLink</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                 <span class="navbar-toggler-icon"></span>
            </button>
            
            {/*Navbar links to home page and gifts*/}
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav mx-auto">
                    <li className="nav-item">
                        <a className="nav-link" href='/home.html' >Home</a>

                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app">Gifts</a>
                    </li>
                     <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>

                 </ul>
                <ul className='navbar-nav'>
                    {isLoggedIn && userName?(
                        <>
                            <li className='nav-item mx-2 mb-0'>Welcome <span className='nav-link m-0 p-0 text-end' style={{color: "black", cursor: "pointer"}} onClick={profileSection}> {userName} </span></li>
                            <li className='nav-item me-3'><button className='nav-link login-btn ' onClick={handleLogout}>Logout</button></li>
                        </>
                    ):(<>
                    </>)}

                </ul>
               
            </div>
        </nav>
    );
}
