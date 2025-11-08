import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Navbar from "../components/Navbar";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication process
        setTimeout(() => {
            setIsLoading(false);
            console.log(isLogin ? 'Login attempted' : 'Account creation attempted', {
                email, password, fullName, businessName
            });

            // Redirect after successful auth
            if (next) {
                navigate(next);
            } else {
                navigate('/dashboard');
            }
        }, 1500);
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        // Reset form fields when switching modes
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setBusinessName('');
    };

    return (
        <div className=" flex flex-col h-screen">
            <Navbar />
            <div className="pos-auth-container">
                <div className="pos-auth-card">
                    <div className="pos-auth-header">
                        <h1 className="pos-auth-title">POS System</h1>
                        <p className="pos-auth-subtitle">
                            {isLogin ? 'Sign in to your account' : 'Create your business account'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="pos-auth-form">
                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="businessName" className="form-label">
                                        Business Name
                                    </label>
                                    <input
                                        id="businessName"
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter your business name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="fullName" className="form-label">
                                        Your Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder={isLogin ? "Enter your password" : "Create a password"}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    required
                                />
                                {password && confirmPassword && password !== confirmPassword && (
                                    <p className="error-message">Passwords do not match</p>
                                )}
                            </div>
                        )}

                        {isLogin && (
                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <a href="/forgot-password" className="forgot-password">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`auth-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading || (!isLogin && password !== confirmPassword)}
                        >
                            {isLoading ? (
                                <span className="button-loading">
                                    <span className="spinner"></span>
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </span>
                            ) : (
                                isLogin ? 'Sign in' : 'Create account'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                type="button"
                                className="auth-toggle"
                                onClick={toggleAuthMode}
                            >
                                {isLogin ? 'Create account' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
}