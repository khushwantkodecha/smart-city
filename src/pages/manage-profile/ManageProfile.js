import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/ManageProfile.css";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Loader from "../../components/loader/Loader";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ManageProfile({ setUserStateChange }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
  });
  const [userExists, setUserExists] = useState(true);
  const [nationalities, setNationnalities] = useState([]);
  const [loading, setLoading] = useState(false);

  const signoutHandler = () => {
    const href = window.location.origin;
    axios
      .get("https://pssk-api.azurewebsites.net/Authentication/Logout")
      .then((res) => {
        localStorage.removeItem("user");
        setUserStateChange(false);
        var new_URL = res.data.toString();
        new_URL = new_URL.replace("{RedirectUrl}", "http://localhost:3000");
        window.location = new_URL;
      });
  };

  useEffect(() => {
    setLoading(true);
    const url = window.location.href;
    const urlParams = new URLSearchParams(`?${url.split("#")[1]}`);
    let access_token = urlParams.get("access_token");
    console.log("i am in manage profile");
    if (!access_token) {
      access_token = JSON.parse(localStorage.getItem("user"))?.access_token;
    }
    axios
      .get("https://pssk-api.azurewebsites.net/Authentication/Profile", {
        headers: {
          access_key: access_token,
        },
      })
      .then((res) => {
        if (res.data.email_verified) {
          const data = {
            access_token,
            authUserId: res.data.sub,
            email: res.data.email,
            email_verified: res.data.email_verified,
            name: res.data.name,
          };
          localStorage.setItem("user", JSON.stringify(data));

          const nameData = {};
          const splittedName = res.data.name ? res.data.name.split(" ") : null;
          if (splittedName) {
            nameData.firstName = splittedName[0];
            nameData.lastName =
              splittedName.length > 0
                ? splittedName.slice(1, splittedName.length).join(" ")
                : "";
          }

          axios
            .get("https://pssk-api.azurewebsites.net/User/Nationalities")
            .then((resNat) => {
              setNationnalities(resNat.data);
              setUserStateChange(true);
              setUserData({
                ...userData,
                ...nameData,
                nationality: resNat?.data[0]?.value,
                email: res.data.email,
              });
              getUserData();
            })
            .catch((err) =>
              notify("Something went wrong while fetching nationalities!")
            );
        } else {
          notify("Email not verified");

          // setTimeout(() => {
          signoutHandler();
          // }, 2000);
        }
      });
  }, []);

  const getUserData = () => {
    axios
      .get("https://pssk-api.azurewebsites.net/User", {
        params: {
          authUserId: JSON.parse(localStorage.getItem("user")).authUserId,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const localUserData = JSON.parse(localStorage.getItem("user"));
          const data = {
            ...localUserData,
            userId: response.data.id,
            qrCode: response.data.qrCode,
          };
          localStorage.setItem("user", JSON.stringify(data));
          setUserData({
            ...response.data,
            dateOfBirth: moment(response.data.dateOfBirth).format("DD/MM/YYYY"),
          });
          setUserStateChange(false);
          setUserExists(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.includes("User Not Found")) {
          setUserExists(false);
          setLoading(false);
        }
      });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
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

  const createUserHandler = () => {
    setLoading(true);
    const payload = {
      ...userData,
      authUserid: JSON.parse(localStorage.getItem("user")).authUserId,
      issueDate: "2022-07-29T13:06:15.288Z",
      expiryDate: "2022-07-29T13:06:15.288Z",
    };
    axios
      .post("https://pssk-api.azurewebsites.net/User/Create", payload)
      .then(() => {
        const localUserData = JSON.parse(localStorage.getItem("user"));
        const data = {
          ...localUserData,
          email: userData.email,
        };
        localStorage.setItem("user", JSON.stringify(data));
        getUserData();
        notify("User Updated Successfully!");
      })
      .catch(() => notify("Something went wrong!"));
  };

  return (
    <>
      {JSON.parse(localStorage.getItem("user"))?.email_verified && (
        <Typography variant="h5" sx={{ mb: 3 }}>
          {userExists ? "Manage Profile" : "Please tell us more about yourself"}
        </Typography>
      )}
      <ToastContainer />
      <div className="mangeprofile">
        {loading ? (
          <Loader />
        ) : (
          <div className="manageprofile_content">
            {userExists ? (
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      First Name :{" "}
                      <span className="fw-bold">{userData.firstName}</span>
                    </div>
                    <div className="col">
                      Last Name :{" "}
                      <span className="fw-bold">{userData.lastName}</span>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col">
                      Email : <span className="fw-bold">{userData.email}</span>
                    </div>
                    <div className="col">
                      Date Of Birth :{" "}
                      <span className="fw-bold">{userData.dateOfBirth}</span>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col">
                      Nationality :{" "}
                      <span className="fw-bold">{userData.nationality}</span>
                    </div>
                    <div className="col">
                      Passport No :{" "}
                      <span className="fw-bold">{userData.passportNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      onChange={(e) => onChangeHandler(e)}
                      placeholder="Firstname"
                      name="firstName"
                      value={userData.firstName}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      onChange={(e) => onChangeHandler(e)}
                      placeholder="Lastname"
                      name="lastName"
                      value={userData.lastName}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <input
                      type="email"
                      onChange={(e) => onChangeHandler(e)}
                      placeholder="Email"
                      name="email"
                      value={userData.email}
                      disabled={
                        JSON.parse(localStorage.getItem("user"))?.email
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div className="col">
                    <input
                      type="date"
                      onChange={(e) => onChangeHandler(e)}
                      placeholder="Date Of Birth"
                      name="dateOfBirth"
                      value={userData.dateOfBirth}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <select
                      value={userData.nationality}
                      name="nationality"
                      onChange={(e) => onChangeHandler(e)}
                      placeholder="Nationality"
                    >
                      {nationalities.map((item) => (
                        <option value={item.value} key={item.id}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      onChange={(e) => onChangeHandler(e)}
                      placeholder="Passport No"
                      name="passportNumber"
                      value={userData.passportNumber}
                    />
                  </div>
                </div>
                <div className="row float-end mt-3">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={createUserHandler}
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageProfile;
