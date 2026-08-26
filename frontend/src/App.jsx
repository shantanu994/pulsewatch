import { useState } from "react";
import Login from "./pages/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <h1 className="font-display text-2xl text-offwhite">Logged in! Dashboard coming next.</h1>
    </div>
  );
}

export default App;