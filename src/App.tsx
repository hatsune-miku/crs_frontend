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
  const colorSchemeControl = [
    useColorSchemeJoyUI(),
    useColorSchemeMaterialUI()
  ]

  const setMode = (mode: any) => {
    for (const scheme of colorSchemeControl) {
        scheme.setMode(mode);
    }
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<PageLogin />} />
            <Route path="/student" element={<PageGeneric setMode={setMode} role="student" />} />
            <Route path="/staff" element={<PageGeneric setMode={setMode} role="staff" />} />
            <Route path="/admin" element={<PageGeneric setMode={setMode} role="admin" />} />
        </Routes>
      </Router>
    </div>
  );
}
