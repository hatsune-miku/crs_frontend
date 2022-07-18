import React from "react";
import "./App.scss";

import { useColorScheme } from "@mui/joy/styles";

// The router.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import PageMain from "./components/page_main";
import PageLogin from "./components/page_login";

export default function App() {
  useColorScheme().setMode("dark");

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<PageLogin />} />
        </Routes>
      </Router>
    </div>
  );
}
