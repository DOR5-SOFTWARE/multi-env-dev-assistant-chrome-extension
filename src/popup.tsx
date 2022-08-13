import React from "react";
import ReactDOM from "react-dom";
import { PopupView } from "./components/popup/popup-view";
import './styles/main.scss';

ReactDOM.render(
  <React.StrictMode>
    <PopupView />
  </React.StrictMode>,
  document.getElementById("popup-container")
);
