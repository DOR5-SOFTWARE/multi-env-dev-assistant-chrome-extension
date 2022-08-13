import React from "react";
import ReactDOM from "react-dom";
import { OptionsView } from "./components/options/options-view";
import './styles/main.scss';

ReactDOM.render(
  <React.StrictMode>
    <OptionsView />
  </React.StrictMode>,
  document.getElementById("options-container")
);
