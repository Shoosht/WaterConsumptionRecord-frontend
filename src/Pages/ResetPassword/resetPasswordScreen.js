import './resetPasswordScreen.css';
import githubLogo from '../../Components/Icons/github-mark.svg';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogin } from '../../Hooks/useLogin';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const { login, errorLogin } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/user/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const json = await response.json();

            if (response.ok) {
                setSuccess('Password reset successfully! Redirecting to home page...');
                setTimeout(async () => {
                    await login( json.user.email, password )
                    navigate('/home');
                }, 2000);
            } else {
                setError(json.message || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="background">
            <div className="title">
                Water Consumption Record
            </div>
            <div className="login-div">
                <div className="login-centered">
                    <div className="login-title">Reset Password</div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="password" className="login-text">New Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="login-text">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="submit-button">
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                    {error && <div className="fs-error-text">{error}</div>}
                    {errorLogin && <div className="fs-error-text">{errorLogin}</div>}
                    {success && <div className="fs-success-text">{success}</div>}
                </div>
            </div>
            <div className="bottom-left">
                <img height="50px" src={githubLogo} alt="GitHub Logo" />
                <div className="bottom-left-text">Final Thesis Project</div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;