import React from 'react'
import reactLogo from "../../assets/react.svg";
import { toast } from 'react-toastify';

function CreatePost() {
  return (
    <>
      <nav className="navbar bg-dark bg-body-tertiary p-3" data-bs-theme="dark">
        <div className="navbar-brand ms-sm-3 ms-1">
          <img
            src={reactLogo}
            alt="Bootstrap"
            // width="40"
            height="40"
          />
          <a href="/" className="text-reset text-decoration-none mx-2">
            DevLink
          </a>
        </div>
        {/* <div className="navbar-item">
          <a href="/register" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">
            Register
          </a>
        </div> */}
      </nav>



    </>
  );
  
}

export default CreatePost
