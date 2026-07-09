import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="1028689177195-j2meeasb3l5pp4d1dga53h056efs4gck.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);