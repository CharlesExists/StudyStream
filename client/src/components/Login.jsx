import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      console.log("Logged in");
    } catch (e) {
      setErr(e.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      console.log("Google sign-in");
    } catch (e) {
      setErr(e.message || "Google sign-in failed.");
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
        {/* Figma-style title pill */}
        <div className="title-pill">
          <h1 id="auth-title" className="title">Ahoy there!</h1>
        </div>

        {/* Narrower Google button like mock */}
        <button type="button" className="google" onClick={onGoogle} disabled={loading}>
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label htmlFor="identifier" className="label">Username, Email, or Phone</label>
          <input
            id="identifier"
            className="input"
            type="text"
            placeholder="Enter your username, email, or mobile number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label htmlFor="password" className="label">Password</label>
          <div className="pw-wrap">
            <input
              id="password"
              className="input pw"
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          {err && <p className="error" role="alert">{err}</p>}

          <div className="row">
            <p className="muted">
              Don’t have an account? <a className="link" href="/signup">Join the crew!</a>
            </p>
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
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
