import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store/store";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { overrideAlert } from "./utils/alertOverride";
import { Toaster } from "react-hot-toast";

overrideAlert();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <LanguageProvider>
      <Toaster />
      <App />
    </LanguageProvider>
  </Provider>
);
