import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MonitorDetail from "./pages/MonitorDetail";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState("login");
  const [selectedMonitor, setSelectedMonitor] = useState(null);

  if (!loggedIn) {
    if (authMode === "signup") {
      return (
        <Signup
          onSignup={() => setLoggedIn(true)}
          onSwitchToLogin={() => setAuthMode("login")}
        />
      );
    }
    return (
      <Login
        onLogin={() => setLoggedIn(true)}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    );
  }

  if (selectedMonitor) {
    return <MonitorDetail monitor={selectedMonitor} onBack={() => setSelectedMonitor(null)} />;
  }

  return <Dashboard onLogout={() => setLoggedIn(false)} onSelectMonitor={setSelectedMonitor} />;
}

export default App;