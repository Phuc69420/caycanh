import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ setIsAuthenticated, loading, setLoading }) => {
  const [loginError, setLoginError] = useState(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  // Mock login process
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    
    // Simulating API call with timeout
    setTimeout(() => {
      if (credentials.username === "admin" && credentials.password === "admin123") {
        setIsAuthenticated(true);
        localStorage.setItem("adminAuthenticated", "true");
      } else {
        setLoginError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
      setLoading(false);
    }, 1000);
  };

  // Handle input changes for login form
  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h2 className="text-center mb-4">Đăng Nhập Quản Trị</h2>
        {loginError && <div className="alert alert-danger">{loginError}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Tên đăng nhập</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleCredentialChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleCredentialChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>
        
        <div className="mt-3 text-center">
          <Link to="/" className="text-decoration-none">← Quay lại trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
