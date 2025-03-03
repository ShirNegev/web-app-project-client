import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
  };

  return (
      <div className="card p-4" style={{ width: "35%" }}>
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <button className="btn btn-dark w-100">
            <i className="bi bi-google me-2"></i>Sign in with Google
          </button>
        </div>
        <div className="text-center mt-3">
          <p>
            Don't have an account? <a href="#" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Sign Up</a>
          </p>
        </div>
      </div>
  );
};

export default Login;