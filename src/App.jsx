import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function RequireAuth({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem("auth"));
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("auth"));
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/auth/login"} replace />}
        />
        <Route
          path="/auth/login"
          element={<LoginPage navigate={(to) => (window.location.href = to)} />}
        />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePage navigate={(to) => (window.location.href = to)} />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
