import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Authpage.css";
import server from "../environment.js";


const AuthPage = () => {
    const [islogin, setIslogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const { login } = useAuth();

    const API_URL = `${server}/auth`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const endpoint = islogin ? "/login" : "/register";
        const body = islogin ? { email, password } : { username, email, password };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            if (islogin) {
                login(data.user, data.token);
            } else {
                setIslogin(true);
                setError("Registration successful. please login");
                setPassword("");
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{islogin ? "login to SigmaGPT" : "Create a account"}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {!islogin && (
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">
                        {islogin ? "login" : "Sign Up"}

                    </button>
                </form>
                <div className="auth-switch">
                    <p>
                        {islogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => {
                            setIslogin(!islogin);
                            setError(" ");
                        }}>
                            {islogin ? "Sign Up" : "login"}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default AuthPage;
