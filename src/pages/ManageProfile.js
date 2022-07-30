import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ManageProfile.css";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Loader from "../components/Loader";

function ManageProfile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
  });
  const [userExists, setUserExists] = useState(false);
  const [nationalities, setNationnalities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = window.location.href;
    const urlParams = new URLSearchParams(`?${url.split("#")[1]}`);
    let access_token = urlParams.get("access_token");
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

        setUserData({
          ...userData,
          ...nameData,
          email: res.data.email,
        });
        axios
          .get("https://pssk-api.azurewebsites.net/User/Nationalities")
          .then((resNat) => {
            setNationnalities(resNat.data);
            getUserData();
          })
          .catch((err) => console.log("nationality api error!"));
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
          };
          localStorage.setItem("user", JSON.stringify(data));
          console.log(
            "fsdfs",
            moment(response.data.dateOfBirth).format("dd/mm/yyyy")
          );
          setUserData({
            ...response.data,
            dateOfBirth: moment(response.data.dateOfBirth).format("DD/MM/YYYY"),
          });
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

  console.log("data", userData);

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
        getUserData();
        notify("User Updated Successfully!");
      })
      .catch(() => notify("Something went wrong!"));
  };

  return (
    <>
      <h3 className="mb-3">Manage Profile</h3>
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
                      placeholder="Email"
                      name="email"
                      value={userData.email}
                      disabled
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
