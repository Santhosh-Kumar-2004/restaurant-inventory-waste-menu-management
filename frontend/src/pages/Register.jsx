import { useState } from "react";
import { createUser } from "../services/authService";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const handleRegister = async () => {
    try {
      await createUser({
        full_name: fullName,
        email,
        password
      });

      setResult("User registered successfully. Please login.");
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setResult(err.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
        <div className="auth-card">
        <div className="auth-header">
            <div className="auth-logo">📝</div>
            <h2>Create Account</h2>
            <p>Join our agricultural auction community today</p>
        </div>

        <div className="auth-form">
            <div className="form-group">
            <label>Full Name</label>
            <input
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
            <label>Email Address</label>
            <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
            <label>Password</label>
            <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            <button className="auth-submit-btn" onClick={handleRegister}>
            Register Now
            </button>
        </div>

        {result && (
            <div className={`auth-message ${result.includes("successfully") ? "success" : "error"}`}>
            {result}
            </div>
        )}

        <div className="auth-footer">
            <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
        </div>
    </div>
    );
}

export default Register;
