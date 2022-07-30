import React, { useState } from "react";
import "../css/Login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader";

function Login() {
  const [data, setData] = useState({});

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const signinHandler = () => {
    const href = window.location.href;
    axios
      .get("https://pssk-api.azurewebsites.net/Authentication/Login")
      .then((res) => {
        var new_URL = res.data.toString();
        new_URL = new_URL.replace("{RedirectUrl}", `${href}Homepage`);
        window.location = new_URL;
      });
  };

  const notify = (value) =>
    toast.success(value, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: 0,
    });

  const signupHandler = () => {
    axios
      .post(`http://pssk-api.azurewebsites.net/Authentication/Signup`, data)
      .then((res) => notify("User Registered successfully!"))
      .catch((error) => notify("User already exists!"));
  };

  return (
    <>
      <div className="landing">
        <ToastContainer />
        <div className="landing_content">
          <div className="login_container">
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={(e) => onChangeHandler(e)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => onChangeHandler(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => onChangeHandler(e)}
            />
            <button className="login_btn" type="submit" onClick={signupHandler}>
              Register
            </button>
            <p style={{ textAlign: "center" }}>Or</p>
            <h5 style={{ textAlign: "center", marginTop: 5 }}>
              Already have an account{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={signinHandler}
              >
                Login
              </span>
            </h5>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
