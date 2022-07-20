import React from "react";
import "./App.scss";

import { useColorScheme as useColorSchemeJoyUI } from "@mui/joy/styles";
import { useColorScheme as useColorSchemeMaterialUI } from "@mui/material/styles";

// The router.
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import PageLogin from "./components/page_login";
import PageGeneric from "./components/page_generic";

export default function App() {
  useColorSchemeJoyUI().setMode("dark");
  useColorSchemeMaterialUI().setMode("dark");

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<PageLogin />} />
            <Route path="/student" element={<PageGeneric role="student" />} />
            <Route path="/staff" element={<PageGeneric role="staff" />} />
            <Route path="/admin" element={<PageGeneric role="admin" />} />
        </Routes>
      </Router>
    </div>
  );
}
