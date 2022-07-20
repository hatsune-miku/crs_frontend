import React from "react";
import ReactDOM from "react-dom/client";

import "./index.scss";
import App from "./App";

import {StyledEngineProvider, CssVarsProvider} from "@mui/joy/styles";
import {ThemeProvider, createTheme} from "@mui/material/styles";

import reportWebVitals from "./profiler/reportWebVitals";
import {MuiCompatCssVarsProvider} from "./joyui_ext/mui_compat";

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <MuiCompatCssVarsProvider>
                <CssVarsProvider>
                    <App/>
                </CssVarsProvider>
            </MuiCompatCssVarsProvider>
        </StyledEngineProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(() => {
});
