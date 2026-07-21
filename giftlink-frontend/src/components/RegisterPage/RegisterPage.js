import React, {useState} from "react"; 
import {Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";

function RegisterPage(){


    //user inputs state variables
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Error state
    const[showErr, setShowErr] = useState("");

    //Navigation
    const navigate = useNavigate();

    //context 
    const {setIsLoggedIn} = useAppContext();

   

    const handleRegister = async ()=>{
        //Back end url and data
        const registerUrl = `${urlConfig.backendUrl}/api/auth/registe`
        const userInfo = {firstName, lastName, email, password};

        //Send data
        const registerResponse = await fetch(registerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(userInfo),
        });

        if (registerResponse.status === 409){
            setShowErr(registerResponse.message || "Error: User already exists");
        }

        //Response handling
         const registeredInfo = await registerResponse.json();
        if (registeredInfo.error){
            setShowErr(registeredInfo.error);
        }
        if (registeredInfo.authtoken && registeredInfo.email){
            sessionStorage.setItem("auth-token", registeredInfo.authtoken);
            sessionStorage.setItem("name", firstName);
            sessionStorage.setItem("email", registeredInfo.email)
            setIsLoggedIn(true);
            navigate("/app");
        }
      
      
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">Firstname</label>
                            <input id="firstName" type="text" className="form-control" placeholder="Enter your firstname" value={firstName}
                            onChange={(e)=> setFirstName(e.target.value)}/>
                        </div>


                         <div className="mb-3">
                               <label htmlFor="lastName" className="form-label">Lastname</label>
                            <input id="lastName" type="text" className="form-control" placeholder="Enter your lastname" value={lastName}
                            onChange={(e)=> setLastName(e.target.value)}/>
                         
                        </div>

                         <div className="mb-3">
                                  <label htmlFor="email" className="form-label">Email</label>
                            <input id="email" type="email" className="form-control" placeholder="Enter your email" value={email}
                            onChange={(e)=> setEmail(e.target.value)}/>
                        </div>


                         <div className="mb-3">
                             <label htmlFor="password" className="form-label">Password</label>
                            <input id="password" type="password" className="form-control" placeholder="Enter your password" value={password}
                            onChange={(e)=> setPassword(e.target.value)}/>                      
                        </div>              

                            <button className="bttn bttn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
                            <div className="text-danger">{showErr}</div>

                        <p className="mt-4 text-center"> 
                            Already a member? <Link to="/app/login" className="text-primary">Login</Link>
                        </p>
                    </div> 
                </div>
            </div>

        </div>
    )
};

export default RegisterPage;