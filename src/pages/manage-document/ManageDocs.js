import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { BsEye } from "react-icons/bs";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 280,
  bgcolor: "background.paper",
  border: "1px solid rgba(0, 0, 0, 0.0625)",
  boxShadow: 24,
  p: 4,
  borderRadius: "4px",
};

function ManageDocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const handleClose = () => {
    setSelDoc(null);
    setModalLoading(false);
    setOpen(false);
  };
  const [selDoc, setSelDoc] = useState(null);
  const navigate = useNavigate();
  const notify = (value) =>
    toast(value, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      // pauseOnHover: true,
      draggable: false,
      progress: 0,
    });
  const getDocs = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.userId;
    axios
      .get(`https://pssk-api.azurewebsites.net/Document?userId=${userId}`)
      .then((res) => {
        setDocs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        notify("Something went wrong while fetching docs!");
      });
  };
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?.userId;
    if (!userId) {
      notify("Please complete profile!");
      setTimeout(() => {
        navigate("/Homepage");
      }, 2000);
    } else {
      setLoading(true);
      getDocs();
    }
  }, []);

  const getStatusColor = (status) => {
    console.log(typeof status);
    let color;
    if (status == "PendingApproval") color = "orange";
    else if (status == "Rejected") color = "red";
    else color = "green";
    return color;
  };

  const deleteDocument = (item) => {
    const userid = JSON.parse(localStorage.getItem("user"))?.userId;
    console.log(typeof item.name);
    console.log(userid.type);
    axios
      .delete(
        `https://pssk-api.azurewebsites.net/Document/Delete?userId=${userid}&documentName=${item.name}`
      )
      .then((res) => {
        notify(`${item.documentType.type} has been Successfully deleted `);
        getDocs();
      })
      .catch((err) => console.log("error in deleting :", err));
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-5">
        <Typography variant="h5">Manage your Documents</Typography>
       
      </div>
      
      <h6>National ID and Travel Documents are mandatory to upload.</h6>
      <div className="manage_docs">
        <ToastContainer />
        <div className="manage_docs_content">
          {loading ? (
            <Loader />
          ) : docs.length > 0 ? (
            <table className="table table-hover">
              <thead className="text-center">
                <tr>
                  <th>#</th>
                  {/* <th>Name</th> */}
                  <th>Type</th>
                  <th>Status</th>
                  <th>View</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {docs.map((item, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    {/* <td>{item.displayName}</td> */}
                    <td>{item.documentType.type}</td>
                    <td style={{ color: getStatusColor(item.status) }}>
                      {item.status}
                    </td>
                    <td title="view">
                      <BsEye
                        onClick={() => {
                          setModalLoading(true);
                          const userid = JSON.parse(
                            localStorage.getItem("user")
                          )?.userId;
                          axios
                            .get(
                              `https://pssk-api.azurewebsites.net/Document/Base64?documentName=${item.name}&userId=${userid}`
                            )
                            .then((res) => {
                              console.log("user id is :", userid);
                              console.log(item);
                              console.log(res.data);
                              setSelDoc(res.data);
                              setModalLoading(false);
                            });

                          setOpen(true);
                        }}
                      />
                    </td>
                    <td title="view">
                      <DeleteIcon
                        onClick={() => {
                          deleteDocument(item);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center">
              <h4 className="mb-4">No Document Found!</h4>
            </div>
          )}
          <center><Button  onClick={() => navigate("/upload-docs")}>Upload New</Button></center>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              {modalLoading ? (
                <Loader />
              ) : (
                <img width={335} src={selDoc} alt="view doc img" />
              )}
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
}

export default ManageDocs;
