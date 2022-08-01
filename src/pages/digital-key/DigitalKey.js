import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "../../components/loader/Loader";
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
    const email = JSON.parse(localStorage.getItem("user"))?.email;
    setLoading(true);
    axios
      .get(`https://pssk-api.azurewebsites.net/User/${email}/QRCode`)
      .then((res) => {
        setLoading(false);
        setQrData(res.data);
      })
      .catch((err) => {
        notify("Something went wrong!");
      });
    // setQrData(JSON.parse(localStorage.getItem("user"))?.qrCode);
  }, []);

  const imageUrl = qrData ? `data:image/png;base64,${qrData}` : null;

  return (
    <>
      <h3 className="mb-3">Digital Key</h3>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="digitalkey w-100">
          <div className="digitalkey_content d-flex flex-column align-items-center">
            <img width={500} src={imageUrl} alt="qr code" />
            <button className="btn btn-primary mt-5">Download QR Code</button>
          </div>
        </div>
      )}
    </>
  );
}

export default DigitalKey;
