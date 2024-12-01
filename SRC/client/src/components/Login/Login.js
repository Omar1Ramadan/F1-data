import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // State to toggle between Admin and User login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/admin/login', {
        username,
        password,
      });

      if (response.status === 200) {
        onLoginSuccess(); // Handle success
      }
    } catch (err) {
      console.error(err.response?.data || 'Login failed');
    }
  };

  const toggleLoginType = () => {
    setIsAdmin(!isAdmin); // Toggle between Admin and User login
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className={`login-form ${isAdmin ? "admin" : "user"}`}>
          <h1>{isAdmin ? "Admin Login" : "User Login"}</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">
              {isAdmin ? "Login as Admin" : "Login as User"}
            </button>
          </form>
          <p className="toggle-text">
            {isAdmin ? "Not an admin?" : "Are you an admin?"}
              <button className="toggle-login" onClick={toggleLoginType}>
            {isAdmin ? "Switch to User Login" : "Switch to Admin Login"}
              </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
