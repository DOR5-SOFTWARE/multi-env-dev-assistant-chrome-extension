import React from "react";
import ReactDOM from "react-dom";
import { PopupView } from "./components/popup/popup-view";
import CssBaseline from '@mui/material/CssBaseline';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <PopupView />
  </React.StrictMode>,
  document.getElementById("popup-container")
);
