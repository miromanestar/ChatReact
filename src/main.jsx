import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './services/AuthProvider'
import "./index.scss";
import App from "./App";
import { ThemeProvider } from "react-jss";
import {
    ThemeProvider as MUIThemeProvider,
    StyledEngineProvider,
    createTheme
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
    }
})

ReactDOM.render(
    <Router>
        <MUIThemeProvider theme={theme}>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <StyledEngineProvider injectFirst>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </StyledEngineProvider>
            </ThemeProvider>
        </MUIThemeProvider>
    </Router>,
    document.getElementById("root")
);
