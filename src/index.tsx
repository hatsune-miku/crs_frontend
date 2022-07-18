import React from "react";
import ReactDOM from "react-dom/client";

import "./index.scss";
import App from "./App";

import { StyledEngineProvider, CssVarsProvider } from "@mui/joy/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

import reportWebVitals from "./profiler/reportWebVitals";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CssVarsProvider>
        <ThemeProvider theme={muiTheme}>
          <App />
        </ThemeProvider>
      </CssVarsProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(() => {});
