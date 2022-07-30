import axios from "axios";
import React, { useState } from "react";
import "../css/UploadFiles.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function UploadFiles() {
  const [selectedFile, setSelectedFile] = React.useState(null);

  const [selDOcId, setSelDocId] = useState(1);
  const [loading, setLoading] = useState(false);

  const filetypeOpts = [
    { key: "National Id Card", value: 1 },
    { key: "Passport", value: 2 },
    { key: "Driving License ", value: 3 },
  ];

  const [baseCode, setBaseCode] = useState(null);

  const navigate = useNavigate();

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

  const handleSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    formData.append("name", selectedFile);
    console.log("formdata comin", selectedFile, baseCode);

    const payload = {
      name: selectedFile.name,
      displayName: selectedFile.name,
      fileExtension: selectedFile.name.split(".").pop(),
      document: baseCode.split(",").pop(),
      documentTypeId: Number(selDOcId),
      userId: JSON.parse(localStorage.getItem("user"))?.userId,
    };

    console.log("pay", payload);
    axios({
      method: "post",
      url: "https://pssk-api.azurewebsites.net/Document/Upload",
      data: payload,
    })
      .then((res) => {
        setLoading(false);
        notify("Document Uploaded!");
        setTimeout(() => {
          navigate("/manage-docs");
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        notify("Something went wrong!");
        console.log(err);
      });
  };

  const handleFileSelect = (el) => {
    let filePayload;

    const reader = new FileReader();
    const file = el.target.files[0];
    reader.onload = handleReaderLoad;
    reader.readAsDataURL(file);
    function handleReaderLoad(e) {
      console.log("running handleReaderLoad()", e);
      filePayload = e.target.result;
      console.log("filePayload", filePayload);
      setBaseCode(filePayload);
    }
    setSelectedFile(el.target.files[0]);
  };
  return (
    <>
      <h3 className="mb-3">Upload Document</h3>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="upload_files">
          <div className="upload_files_content">
            <div>
              <select onChange={(e) => setSelDocId(e.target.value)}>
                {filetypeOpts.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.key}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                {/* <input type="file"  /> */}
                <div>
                  <input
                    class="form-control"
                    type="file"
                    onChange={(e) => handleFileSelect(e)}
                  />
                </div>
              </div>
              <button
                className="btn btn-primary w-100 mt-4"
                onClick={handleSubmit}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadFiles;
