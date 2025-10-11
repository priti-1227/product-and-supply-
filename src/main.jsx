import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { store } from "./store/store";
import { Provider } from "react-redux";
import NotificationContainer from "./components/common/NotificationContainer";
import ErrorBoundary from "./components/common/ErrorBoundary";
// import './global.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
       <ErrorBoundary>
      <Provider store={store}>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    
    
    <App />
     <NotificationContainer />
  </ThemeProvider>
  </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
