import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PATHS } from "./constants/routes";
import "./App.scss";

const App = () => {
  return (
    <BrowserRouter>
      <div className="main-pages-wrapper">
        <div className="nav-wrapper">
          <ul>
            {PATHS.map((RouteConstant) => (
              <li key={`${RouteConstant.path}-nav-link`}>
                <Link to={RouteConstant.path}>{RouteConstant.linkText}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Routes>
            {PATHS.map((RouteConstant) => (
              <Route
                key={RouteConstant.path}
                element={<RouteConstant.Component />}
                path={RouteConstant.path}
              />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
