import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MonitorDetail from "./pages/MonitorDetail";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [selectedMonitor, setSelectedMonitor] = useState(null);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  if (selectedMonitor) {
    return (
      <MonitorDetail
        monitor={selectedMonitor}
        onBack={() => setSelectedMonitor(null)}
      />
    );
  }

  return (
    <Dashboard
      onLogout={() => setLoggedIn(false)}
      onSelectMonitor={setSelectedMonitor}
    />
  );
}

export default App;