import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/userStore";
import {createContext} from 'react';
import ErrorBoundary from "./components/Error";
import {BrowserRouter} from "react-router-dom";
import TimerStore from "./store/timerStore";
import AdminStore from "./store/adminStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          timer: new TimerStore(),
          admin: new AdminStore(),
      }}>
          <ErrorBoundary>
              <BrowserRouter>
          <App />
              </BrowserRouter>
          </ErrorBoundary>
      </Context.Provider>
  </React.StrictMode>
);

