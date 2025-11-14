import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import GoogleLogo from '../assets/google.png';
import StudyStreamLogo from '../assets/studyStreamLogo.png';
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"; //firebase imports 


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
        // backend stuff
        const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
        console.log("Logged in as:", userCredential.user);
        alert(`Welcome back, ${userCredential.user.displayName || "User"}!`);
      } catch (e) {
        setErr(e.message || "Login failed.");
      } finally {
        setLoading(false);
      }
  };

  const onGoogle = async () => {
    setErr("");
    setLoading(true);
    try { // more backend stuff
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful:", result.user);
      alert(`Signed in as ${result.user.displayName}`);
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
        <img src={StudyStreamLogo} alt="StudyStream Logo" className="logo-mark"/>
        <span className="brand-text-login">StudyStream</span>
      </header>

      <section className="login-card" role="main" aria-labelledby="auth-title">
        <div className="title-pill">
          <h1 id="auth-title" className="title">Ahoy there!</h1>
        </div>

        <button type="button" className="google" onClick={onGoogle} disabled={loading}>
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <form className="form" onSubmit={onSubmit}>
          <label htmlFor="identifier" className="label">Email</label>
          <input
            id="identifier"
            className="input"
            type="email"
            placeholder="Enter your email"
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
              Don’t have an account? <Link className="link" to="/SignUp">Join the crew!</Link>
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
    <img src={GoogleLogo} alt="Google logo" className="gicon" width={18} height={18}/>
  );
}
