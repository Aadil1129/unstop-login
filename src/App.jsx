import { useEffect, useMemo, useState } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(localStorage.getItem("auth")), [path]);

  useEffect(() => {
    if (path === "/") {
      navigate(isAuthenticated ? "/home" : "/auth/login", true);
    }
  }, [path, isAuthenticated]);

  function navigate(to, replace = false) {
    if (replace) {
      window.history.replaceState({}, "", to);
    } else {
      window.history.pushState({}, "", to);
    }
    setPath(to);
  }

  if (path === "/auth/login") return <LoginPage navigate={navigate} />;
  if (path === "/home") return <HomePage navigate={navigate} />;
  return null;
}

export default App;
