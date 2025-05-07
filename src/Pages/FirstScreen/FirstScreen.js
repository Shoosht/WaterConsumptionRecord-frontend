import './firstScreen.css';
import githubLogo from '../../Components/Icons/github-mark.svg';
import React, { useState } from 'react';
import { Link } from "react-router-dom";


function FirstScreen() {
  const [LoginVisibility, setLoginVisibility] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginButtonClick = () => {
    setLoginVisibility(false); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="background">
        <div className="title">
          Water Consumption Record
        </div>
        <div className="login-button-centered">
          {LoginVisibility ? (
              <div className="login-button" onClick={handleLoginButtonClick}>
                Login
              </div>
            ) : (
              <div className="login-div">
                <div className="login-centered">
                  <div className="login-title">Login</div>
                  <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="email" className="login-text">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="login-text">Password</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="register-text">
                      <div className="register-text-first">Don't have an account yet?</div>
                      <Link to="/register" className="register-text-second">Sign up.</Link>
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                  </form>
                  <div className="guest">
                    <div className="or">
                      or
                    </div>
                    <Link to="/home" className="guest-link">View app as a guest.</Link>
                  </div>
                </div>
              </div>
            )}
        </div>
        <div className="bottom-left">
         <img height="50px" src={githubLogo} alt="GitHub Logo" />
         <div className="bottom-left-text">Final Thesis Project</div>
        </div>
    </div>
  );
}

export default FirstScreen;