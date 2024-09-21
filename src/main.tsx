import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";


import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Auth0Provider
      domain="tour-admin-portal.us.auth0.com"
      clientId="VrT9FTtllpfhrvhZu4uk7jJpFrVYDOyV"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://tour-partner-api.com"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);
