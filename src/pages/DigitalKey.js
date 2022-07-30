import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";

function DigitalKey() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?.userId;
    setLoading(true);
    axios
      .get(`https://pssk-api.azurewebsites.net/User/${userId}/QRCode`)
      .then((res) => {
        setLoading(false);
        setQrData(res.data);
      })
      .catch((err) => {
        console.log(err);
        notify("Something went wrong!");
      });
  }, []);

  return (
    <>
      <h3 className="mb-3">Digital Key</h3>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="digitalkey w-100">
          <div className="digitalkey_content d-flex flex-column align-items-center">
            <img
              width={500}
              src="https://media-cldnry.s-nbcnews.com/image/upload/t_social_share_1024x768_scale,f_auto,q_auto:best/MSNBC/Components/Photo/_new/110322-qr-code-hmed-425p.jpg"
            />
            <button className="btn btn-primary mt-5">Download QR Code</button>
          </div>
        </div>
      )}
    </>
  );
}

export default DigitalKey;
