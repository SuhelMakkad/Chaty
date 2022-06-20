import React, { useState, useEffect } from "react";

import SignIn from "./pages/SignIn.jsx";

import { onAuthChange } from "./firebase/auth.js";

import Home from "./pages/Home.jsx";
import "./scss/App.scss";
import "./scss/variables.scss";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthChange((user) => {
      if (user) {
        setIsLoggedIn(true);
        return;
      }

      setIsLoggedIn(false);
    });
  }, []);

  return <div className="App">{isLoggedIn ? <Home /> : <SignIn />}</div>;
}

export default App;
