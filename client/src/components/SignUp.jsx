import React, { useState } from "react";
import "./SignUp.css";

export default function Signup() {
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirm: '' 
    });
    const [confirm, setShowConfirm] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault(); //prevents default action of browser
        if (!form.name || !form.email || !form.password || !form.confirm) {
            setError("Please fill out all fields.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        try {
        //insert backend stuff later
        console.log("Signed up.");
        } catch (e) {
        setError(e.message || "Signup failed.");
        } finally {
        setLoading(false);
        }
    };

    const onGoogle = async () => {
        setError("");
        setLoading(true);
        try {
        console.log("Google sign-in");
        //backend stuff
        } catch (e) {
        setError(e.message || "Google sign-in failed.");
        } finally {
        setLoading(false);
        }
    };

    return (
    <div className="auth-shell">
      <header className="brand">
        <div className="logo-mark" aria-hidden />
        <span className="brand-text">StudyStream</span>
      </header>

      <section className="login-card" role="main" aria-labelledby="auth-title">
        <div className="title-pill">
          <h1 id="auth-title" className="title">Sign Up</h1>
        </div>

        <button type="button" className="google" onClick={onGoogle} disabled={loading}>
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label htmlFor="name" className="label">Name</label>
          <input
            id="name"
            name="name"
            className="input"
            type="text"
            placeholder="Enter your first and last name"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <label htmlFor="identifier" className="label">Username, Email, or Phone</label>
          <input
            id="identifier"
            name="email"
            className="input"
            type="text"
            placeholder="Enter your username, email, or mobile number"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />

          <label htmlFor="password" className="label">Password</label>
          <div className="pw-wrap">
            <input
              id="password"
              className="input pw"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="confirm" className="label">Confirm password</label>
          <div className="pw-wrap">
            <input
              id="confirm"
              name="confirm"
              className="input pw"
              type={confirm ? "text" : "password"}
              placeholder="Retype your password"
              value={form.confirm}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={confirm ? "Hide confirm password" : "Show confirm password"}
            >
              {confirm ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="error" role="alert">{error}</p>}

          <div className="row">
            <p className="muted">
              Already have an account? <a className="link" href="/Login">Log in here!</a>
            </p>
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
    
}

function GoogleIcon() {
  return (
    <svg className="gicon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.6l2.8-2.7C16.8 3 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.3 0 8.7-4.4 8.7-6.7 0-.5-.1-.8-.1-1.1H12z"/>
    </svg>
  );
}