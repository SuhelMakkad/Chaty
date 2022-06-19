import React, { useState, useEffect } from "react";

import SignIn from "./SignIn.jsx";

import { onAuthChange } from "../firebase/auth.js";

import "../css/App.css";

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

  return (
    <div className="App">
      {String(isLoggedIn)}
      <SignIn />
    </div>
  );
}

export default App;
