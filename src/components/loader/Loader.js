import React from "react";
import "../../assets/css/Loader.css";

function Loader() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Loader;
