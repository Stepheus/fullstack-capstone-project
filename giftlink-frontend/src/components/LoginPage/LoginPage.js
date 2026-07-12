import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

  const navigate = useNavigate();

   useEffect(()=>{
      if(sessionStorage.getItem("auth-token")){
        navigate("/app");
      }
    },[navigate]);

    //state variables
    const [email, setEmail]= useState("");
    const[password, setPassword] = useState("");
    const [showErr, setShowErr] = useState("");
    const {setIsLoggedIn} = useAppContext();

   

    // login function
    const handleLogin = async (e)=>{
        console.log("Inside handleLogin");
        const loginUrl = `${urlConfig.backendUrl}/api/auth/login`;
        const userInput = {email, password};
      
        e.preventDefault();
        //send data 
        try{
          const loginResponse = await fetch(loginUrl, { 
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(userInput),
          });

          const loginInfo = await loginResponse.json();

          if (loginResponse.status === 404){
            console.log("error " + loginResponse.error);
            setShowErr(loginInfo.error || "User not found!");
          };

          console.log({loginInfo})
          if (loginInfo.authtoken && loginInfo.name){
            sessionStorage.setItem("authtoken", loginInfo.authtoken);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("name", loginInfo.name);

            setIsLoggedIn(true);
            navigate("/app");
          }

          


        }catch(error){
          console.error("Error loging in");
        }
      
    }

        return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" 
                    id="email" 
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}/>
                </div>

                <div className="mb-4">
                    <input type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
                <div><span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px', marginBottom:"8px"}}>{showErr}</span></div>
                <button className='btn btn-primary w-100 mb-3' onClick={(handleLogin)}>Login</button>
                <p className="mt-4 text-center">
                    New here? <a href="/app/register" className="text-primary">Register Here</a>
                </p>

            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;