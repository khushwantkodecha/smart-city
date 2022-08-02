import React, { useState } from "react";
import "../../assets/css/Login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { Button, Typography } from "@mui/material";

function Login({ setisLoggedIn}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const signinHandler = () => {
    setLoading(true);
    const href = window.location.href;
    axios
      .get("https://pssk-api.azurewebsites.net/Authentication/Login")
      .then((res) => {
        setLoading(false);
        var new_URL = res.data.toString();
        new_URL = new_URL.replace("{RedirectUrl}", `${href}Homepage`);
        console.log("new_URL", new_URL);
        setisLoggedIn(true)
        window.location = new_URL;
        
      })
      .catch((err) => {
        setLoading(false);
        notify("Something went wrong!");
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
    setLoading(true);
    axios
      .post(`http://pssk-api.azurewebsites.net/Authentication/Signup`, data)
      .then((res) => {
        setLoading(false);
        notify("User Registered successfully!");
      })
      .catch((error) => {
        setLoading(false);
        notify("User already exists!");
      });
  };

  return (
    <>
      <div className="landing">
        <ToastContainer />
        {loading ? (
          <Loader />
        ) : (
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
              <Button
                className="login_btn"
                type="submit"
                variant="contained"
                onClick={signupHandler}
                fullWidth
              >
                Register
              </Button>
              <Typography sx={{ textAlign: "center", mt: 1 }}>Or</Typography>
              <h5 style={{ textAlign: "center", marginTop: 5 }}>
                Already have an account
                <Typography
                  sx={{
                    color: "blue",
                    cursor: "pointer",
                    display: "inline",
                    ml: 1,
                  }}
                  onClick={signinHandler}
                >
                  Login
                </Typography>
              </h5>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
