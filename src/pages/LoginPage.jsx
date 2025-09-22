import { useEffect, useMemo, useState } from "react";
import illustration from "../images/Illustration.png";
import googleLogo from "../images/google.png";
import facebookLogo from "../images/facebook.png";
import userIcon from "../images/account_circle.png";
import mailIcon from "../images/mail.png";
import keyIcon from "../images/key.png";
import visibilityIcon from "../images/visibility.png";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ navigate }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("auth");
    if (existing) navigate("/home", true);
  }, [navigate]);

  function validate(current) {
    const next = {};
    if (current.username.trim() !== "emilys") next.username = 'Username must be "emilys".';
    if (current.email && !EMAIL_REGEX.test(current.email))
      next.email = "Enter a valid email (e.g., example@gmail.com).";
    if (current.password.length < 8) next.password = "Password must be at least 8 characters.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setShowErrors(true);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    setErrors((prev) => ({ ...prev, general: undefined }));
    try {
      const payload = { username: form.username, password: form.password, expiresInMins: 30 };
      if (form.email) payload.email = form.email;
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");

      const toStore = {
        token: data?.token,
        user: { id: data?.id, username: data?.username, email: form.email || undefined },
      };
      localStorage.setItem("auth", JSON.stringify(toStore));
      navigate("/home", true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="split">
      <div className="visual">
        <div className="illustration-image-box">
          <img src={illustration} alt="Login illustration" className="login-illustration" />
        </div>
      </div>
      <div className="content">
        <div className="card login-card">
          <div className="card-body">
            <h1 className="title login-title">Welcome to</h1>
            <div className="title login-brand-purple">Unstop</div>

            {errors.general && <div className="alert">{errors.general}</div>}

            <div className="social-col">
              <button type="button" className="btn block btn-PL text-15">
                <img src={googleLogo} alt="Google" className="w34" />
                Login with Google
              </button>
              <button type="button" className="btn block btn-PL text-15">
                <img src={facebookLogo} alt="Facebook" className="w28" />
                Login with Facebook
              </button>
            </div>

            <div className="or-grid">
              <span className="or-gray" />
              <span className="subtitle muted">OR</span>
              <span className="or-gray" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group field floating">
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <img src={userIcon} alt="user" className="field-icon" />
                  </span>
                  <div className="floating-wrap">
                    <input
                      className="input floating-input"
                      type="text"
                      name="username"
                      placeholder=" "
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    />
                    <span className="floating-label-inline">User name</span>
                  </div>
                </div>
                {showErrors && errors.username && (
                  <div className="error-text">{errors.username}</div>
                )}
              </div>

              <div className="form-group field floating">
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <img src={mailIcon} alt="email" className="field-icon" />
                  </span>
                  <div className="floating-wrap">
                    <input
                      className="input floating-input"
                      type="email"
                      name="email"
                      placeholder=" "
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                    <span className="floating-label-inline">Email</span>
                  </div>
                </div>
                {showErrors && errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <div className="form-group field floating">
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <img src={keyIcon} alt="password" className="field-icon" />
                  </span>
                  <div className="floating-wrap">
                    <input
                      className="input floating-input"
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      name="password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    />
                    <span className="floating-label-inline">Password</span>
                  </div>
                  <span
                    className="input-icon-right"
                    onClick={() => setShowPassword((v) => !v)}
                    title={showPassword ? "Hide" : "Show"}
                  >
                    <img src={visibilityIcon} alt="toggle visibility" className="field-icon-hide" />
                  </span>
                </div>
                {showErrors && errors.password && (
                  <div className="error-text">{errors.password}</div>
                )}
              </div>

              <div className="row-between remember-row">
                <label className="row-between-container">
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
                  />
                  Remember me
                </label>
                <a href="#" className="link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" disabled={submitting} className="btn primary block">
                {submitting ? "Logging in…" : "Login"}
              </button>
            </form>

            <p style={{ marginTop: 12, textAlign: "center", fontSize: 14, color: "#6b7280" }}>
              Don’t have an account?{" "}
              <a href="#" className="link">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
