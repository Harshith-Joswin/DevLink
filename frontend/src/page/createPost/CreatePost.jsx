import React from "react";
import reactLogo from "../../assets/react.svg";
import { toast } from "react-toastify";

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

      <div className="bx-grow container d-flex flex-column align-items-center justify-content-center">
        <h1>Create Post</h1>
        <div className="container">
          <form className="form-control p-3 m-2" method="post">
            <label htmlFor="title" className="form-label">
              Enter Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="rounded form-control"
            />
            <br />

            <label htmlFor="description" className="form-label">
                Enter Description:
              </label>
              <textarea
                name="description"
                id="description"
                className="rounded form-control"
                rows="3"
              ></textarea>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
