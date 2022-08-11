import React from "react";
import ReactDOM from "react-dom";
import { OptionsView } from "./components/options/options-view";
import CssBaseline from '@mui/material/CssBaseline';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <OptionsView />
  </React.StrictMode>,
  document.getElementById("options-container")
);
