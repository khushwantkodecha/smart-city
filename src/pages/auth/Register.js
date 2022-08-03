import React, { useState } from "react";
import "../../assets/css/Login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register({ setUserStateChange }) {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const notify = (value) =>
    toast(value, {
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
      .then(() => {
        setLoading(false);
        notify("User Registered successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
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
            <Typography variant="h5" className="text-center mb-3">
              Sign up for free to continue
            </Typography>
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
                  onClick={() => navigate("/")}
                >
                  Signin
                </Typography>
              </h5>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Register;
