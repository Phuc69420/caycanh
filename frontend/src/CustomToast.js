// src/components/CustomToast.js
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomToast = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      limit={2}  // Limit to 2 notifications
      newestOnTop={true}  // Show newest notifications on top
    />
  );
};

export default CustomToast;