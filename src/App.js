import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import axios from "axios";

// pages import
import ManageProfile from "./pages/ManageProfile";
import Protected from "./routes/Protected";
import ManageDocs from "./pages/ManageDocs";
import UploadFiles from "./components/UploadFiles";

import MenuIcon from "@mui/icons-material/Menu";
import DigitalKey from "./pages/DigitalKey";

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(true);
  const [sideOpen, setSideOpen] = useState(true);

  const signoutHandler = () => {
    const href = window.location.origin;
    console.log("href", href);
    axios
      .get("https://pssk-api.azurewebsites.net/Authentication/Logout")
      .then((res) => {
        var new_URL = res.data.toString();
        new_URL = new_URL.replace("{RedirectUrl}", `${href}`);
        console.log("new_URL", new_URL);
        window.location = new_URL;
      });
  };

  return (
    <div className="app">
      <BrowserRouter>
        {isLoggedIn && sideOpen ? (
          <div className="sidebar">
            <div className="logo_container">
              <img
                className="logo_img"
                width={50}
                height={50}
                src="https://cdn-images-1.medium.com/max/1200/1*1NkKwu_B8cRc-vjE-Ovc9A.png"
              />
              <h4>Publicis Sapient</h4>
            </div>
            <ul>
              <NavLink
                to={"/Homepage"}
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: "blue",
                        textDecoration: "none",
                      }
                    : { color: "#000", textDecoration: "none" }
                }
              >
                <li>Manage Profile</li>
              </NavLink>

              <NavLink
                to={"/manage-docs"}
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: "blue",
                        textDecoration: "none",
                      }
                    : { color: "#000", textDecoration: "none" }
                }
              >
                <li>Manage Document</li>
              </NavLink>
              <NavLink
                to={"/digital-key"}
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: "blue",
                        textDecoration: "none",
                      }
                    : { color: "#000", textDecoration: "none" }
                }
              >
                <li>Digital Key</li>
              </NavLink>
            </ul>
          </div>
        ) : null}

        <div
          className={`${
            isLoggedIn && sideOpen
              ? "content_container"
              : "content_container_full"
          }`}
        >
          <div className={`${isLoggedIn ? "loggedin_header" : "header"}`}>
            {!isLoggedIn ? (
              <div className="logo_container">
                <img
                  className="logo_img"
                  width={50}
                  height={50}
                  src="https://cdn-images-1.medium.com/max/1200/1*1NkKwu_B8cRc-vjE-Ovc9A.png"
                />
                <h4>Publicis Sapient</h4>
              </div>
            ) : (
              <MenuIcon
                sx={{ ml: 1, cursor: "pointer" }}
                onClick={() => setSideOpen(!sideOpen)}
              />
            )}

            {isLoggedIn ? (
              <button className="auth_btn" onClick={signoutHandler}>
                Sign Out
              </button>
            ) : (
              <button className="auth_btn" to="/">
                Sign In
              </button>
            )}
          </div>
          <div className="main_content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/Homepage"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    <ManageProfile />
                  </Protected>
                }
              />
              <Route
                path="/manage-docs"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    <ManageDocs />
                  </Protected>
                }
              />
              <Route
                path="/upload-docs"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    <UploadFiles />
                  </Protected>
                }
              />
              <Route
                path="/digital-key"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    <DigitalKey />
                  </Protected>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
