import './forgotPasswordScreen.css';
import githubLogo from '../../Components/Icons/github-mark.svg';
import React, { useState } from 'react';
import { useForgotPassword } from '../../Hooks/useForgotPassword';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const { message, error, isLoading, forgotPassword } = useForgotPassword();
    const [previewUrl, setPreviewUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await forgotPassword(email);

        if (response.previewUrl) {
            setPreviewUrl(response.previewUrl);
        }
    };

    return (
        <div className="background">
            <div className="title">
                Water Consumption Record
            </div>
            <div className="login-div">
                <div className="login-centered">
                    <div className="login-title">Forgot Password</div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="fp-password-text">
                                Enter your email address and we'll send you a password reset link.
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="submit-button">
                            {isLoading ? 'Sending...' : 'Send reset link'}
                        </button>
                    </form>
                    {error && <div className="fs-error-text">{error}</div>}
                        {message && <div className="fs-success-text">{message}</div>}
                        {message && previewUrl && (
                            <div className="fs-success-text">
                                <div className="fp-text">Email link preview: </div>
                                <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fp-success-url"
                                >
                                {previewUrl}
                                </a>
                            </div>
                        )}
                    <div className="fp-back">
                        <Link to="/" className="fp-back">Back to Login</Link>
                    </div>
                </div>
            </div>
            <div className="bottom-left">
                <img height="50px" src={githubLogo} alt="GitHub Logo" />
                <div className="bottom-left-text">Final Thesis Project</div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;