import { useState } from "react";
import { loginUser } from "../services/authService";
import "../styles/Login.css"
import Register from "./Register";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async () => {
    try {
        const res = await loginUser({ email, password });

        localStorage.setItem("user", JSON.stringify(res));
        setResult("Login successful");
        // window.location.reload(); 
        navigate("/");
    } catch (err) {
        setResult(err.message);
    }
    };


  return (
    <div className="login-page-container">
        <div className="login-card">
        <div className="login-header">
            <div className="login-icon">🔐</div>
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access your account</p>
        </div>

        <div className="login-form">
            <div className="input-field-group">
            <label>Email Address</label>
            <input
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <div className="input-field-group">
            <label>Password</label>
            <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            <button className="login-action-btn" onClick={handleLogin}>
            Login to Dashboard
            </button>
        </div>

        {result && (
            <div className="login-result-container">
            <label>Server Response:</label>
            <pre>{result}</pre>
            </div>
        )}
        
        <div className="auth-footer">
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
        </div>
    </div>
    );
}

export default Login;
