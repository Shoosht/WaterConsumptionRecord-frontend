import './RegisterPage.css';
import githubLogo from '../../Components/Icons/github-mark.svg';
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useSignup } from '../../Hooks/useSignup';

function RegisterPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signup, error, isLoading } = useSignup()

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		await signup(email, password)
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
						<button type="submit" disabled={isLoading} className="submit-button">Sign up</button>
						{error && <div className="rp-error-text">{error}</div>}
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