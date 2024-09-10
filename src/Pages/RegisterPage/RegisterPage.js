import './RegisterPage.css';
import githubLogo from '../../Components/github-mark.svg';
import React, { useState } from 'react';
import { Link } from "react-router-dom";

function RegisterPage() {
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
                      <div className="register-text-first">Already have an account?</div>
                      <Link to="/" className="register-text-second">Log in.</Link>
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
        <div className="bottom-left">
         <img height="50px" src={githubLogo} alt="GitHub Logo" />
         <div className="bottom-left-text">Final Thesis Project</div>
        </div>
    </div>
  );
}

export default RegisterPage;