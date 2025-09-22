import { useEffect } from "react";
import frame from "../images/frame.png";

export default function HomePage({ navigate }) {
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) navigate("/auth/login", true);
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/auth/login", true);
  }

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("auth") || "{}")?.user;
    } catch {
      return undefined;
    }
  })();

  return (
    <div className="home home-center">
      <div className="home-heading">
        <h1 className="title welcome-title">Welcome to</h1>
        <div className="title brand-title">Unstop</div>
      </div>
      <div className="card profile-card">
        <div className="card-body">
          <img src={frame} alt="profile" className="profile-avatar" />
          <div className="profile-name">{user?.username || "User"}</div>
          <div className="profile-email">{user?.email || "example@gmail.com"}</div>
          <div className="profile-gender">Female</div>
          <button onClick={handleLogout} className="btn primary btn-narrow">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
