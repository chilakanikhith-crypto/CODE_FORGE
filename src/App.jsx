import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState({ user: null, token: null });

  const handleLogin = (user, token) => {
    setSession({ user, token });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSession({ user: null, token: null });
  };

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      user={session.user}
      token={session.token}
    />
  );
}