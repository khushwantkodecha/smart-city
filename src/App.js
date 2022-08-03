import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import axios from "axios";

// pages import
import ManageProfile from "./pages/manage-profile/ManageProfile";
import Protected from "./routes/Protected";
import ManageDocs from "./pages/manage-document/ManageDocs";
import UploadFiles from "./pages/manage-document/UploadFiles";

import MenuIcon from "@mui/icons-material/Menu";
import DigitalKey from "./pages/digital-key/DigitalKey";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

import MenuItems from "./menu-items/MenuItems";
import { Button } from "@mui/material";
import Register from "./pages/auth/Register";

const App = () => {
  const user = localStorage.getItem("user");
  const [isLoggedIn, setisLoggedIn] = useState(
    localStorage.getItem("user") || false
  );
  const [userData, setUserData] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);
  const [userStateChange, setUserStateChange] = useState(false);

  const loginStateChangeHandler = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setisLoggedIn(true);
      setUserData(JSON.parse(user));
    } else {
      setisLoggedIn(false);
      setUserData(null);
    }
  };

  console.log("userData", userData);
  useEffect(() => {
    loginStateChangeHandler();
  }, []);

  useEffect(() => {
    loginStateChangeHandler();
  }, [userStateChange]);

  const signoutHandler = () => {
    const href = window.location.origin;
    axios
      .get("https://pssk-api.azurewebsites.net/Authentication/Logout")
      .then((res) => {
        localStorage.removeItem("user");
        setisLoggedIn(false);
        var new_URL = res.data.toString();
        new_URL = new_URL.replace("{RedirectUrl}", "http://localhost:3000");
        window.location = new_URL;
      });
  };

  const userName = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).name
    : "";

  console.log("userName", userName);

  return (
    <div className="app">
      <BrowserRouter>
        {isLoggedIn && sideOpen ? (
          <div className="sidebar">
            <div className="logo_container">
              <img
                className="logo_img"
                alt="Org Logo"
                width={50}
                height={50}
                src="https://cdn-images-1.medium.com/max/1200/1*1NkKwu_B8cRc-vjE-Ovc9A.png"
              />
              <h4>Publicis Sapient</h4>
            </div>
            <ul>
              <NavLink
                to="/Homepage"
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
              {userData?.userId && (
                <>
                  <NavLink
                    to="/manage-docs"
                    style={({ isActive }) =>
                      isActive
                        ? {
                            color: "blue",
                            textDecoration: "none",
                          }
                        : { color: "#000", textDecoration: "none" }
                    }
                  >
                    <li>Manage Documents</li>
                  </NavLink>
                  <NavLink
                    to="/digital-key"
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
                </>
              )}

              {/* {MenuItems.map((item) => {
                return (
                  <NavLink
                    key={item.id}
                    to={`${item.url}`}
                    style={({ isActive }) =>
                      isActive
                        ? {
                            color: "blue",
                            textDecoration: "none",
                          }
                        : { color: "#000", textDecoration: "none" }
                    }
                  >
                    <li>{item.title}</li>
                  </NavLink>
                );
                
              })} */}
              {isLoggedIn ? (
                <li className="signout_link">
                  <Button onClick={signoutHandler}>Sign Out</Button>
                </li>
              ) : null}
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
                  alt="Org Logo"
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
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ mr: 3 }}>
                  {userName?.charAt(0).toUpperCase()}
                </Avatar>
              </Stack>
            ) : (
              <Button sx={{ pr: 2 }} to="/">
                Sign In
              </Button>
            )}
          </div>
          <div className="main_content">
            <Routes>
              <Route
                path="/"
                element={<Login setUserStateChange={setUserStateChange} />}
              />
              <Route path="/sign-up" element={<Register />} />
              <Route
                path="/Homepage"
                element={
                  // <Protected isLoggedIn={isLoggedIn}>
                  <ManageProfile setUserStateChange={setUserStateChange} />
                  // </Protected>
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
