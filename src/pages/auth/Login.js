import React, { useState } from "react";
import "../../assets/css/Login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";

function Login({ setUserStateChange }) {
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

  const signinHandler = (type = "") => {
    setLoading(true);
    const href = window.location.href;
    axios
      .get(
        `https://pssk-api.azurewebsites.net/Authentication/Login?type=${type}`
      )
      .then((res) => {
        setLoading(false);
        var new_URL = res.data.toString();
        console.log("new_URL", new_URL);
        new_URL = new_URL.replace("{RedirectUrl}", `${href}Homepage`);
        setUserStateChange(true);
        window.location = new_URL;
      })
      .catch((err) => {
        setLoading(false);
        notify("Something went wrong!");
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

  return (
    <>
      <div className="landing">
        <ToastContainer />
        {loading ? (
          <Loader />
        ) : (
          <div className="landing_content">
            <Typography variant="h5" className="text-center mb-3">
              Login to continue
            </Typography>
            <div className="login_container">
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
                onClick={() => signinHandler(1)}
                fullWidth
              >
                Login
              </Button>
              <div className="or_container">
                <hr />
                <Typography sx={{ textAlign: "center" }}>
                  Or login with
                </Typography>
                <hr />
              </div>
              <div className="loginwith_container">
                <div onClick={() => signinHandler(2)}>
                  <img
                    width={35}
                    src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png"
                  />
                </div>
                <div onClick={() => signinHandler(3)}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/800px-Facebook_Logo_%282019%29.png"
                    width={35}
                  />
                </div>
                <div onClick={() => signinHandler(4)}>
                  <img
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                    width={35}
                  />
                </div>
                <div onClick={() => signinHandler(5)}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/732/732221.png"
                    width={30}
                  />
                </div>
              </div>

              <h5 style={{ textAlign: "center", marginTop: "1em" }}>
                Don't have an account
                <Typography
                  sx={{
                    color: "blue",
                    cursor: "pointer",
                    display: "inline",
                    ml: 1,
                  }}
                  onClick={() => navigate("/sign-up")}
                >
                  Register
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
