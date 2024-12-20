import React from "react";
import "./home.css";
import reactLogo from "../../assets/react.svg";

function Home() {
  return (
    <>
    {/* Navbar */}
      <nav className="navbar bg-dark bg-body-tertiary p-3" data-bs-theme="dark">
        <div className="navbar-brand ms-sm-3 ms-1" href="#">
          <img
            src={reactLogo}
            alt="Bootstrap"
            height="40"
          />
          <a href="/" className="text-reset text-decoration-none mx-2">
            DevLink
          </a>
        </div>
        <div className="navbar-item">
          <a href="/login" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">
            Login
          </a>
          <a href="/register" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">
            Register
          </a>
        </div>
      </nav>

    {/* Main content to register or login to site */}
      <header className="background p-5 text-center bg-image d-flex justify-content-center align-items-center">
        <div className="mask">
          <div className="d-flex h-100">
            <div className="text-white container">
              <h1 className="mb-3">DevLink</h1>
              <h4 className="mb-3">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellendus et nihil alias reiciendis temporibus aspernatur
                voluptas, in numquam perspiciatis repudiandae!
              </h4>
              <a
                data-mdb-ripple-init
                className="btn btn-outline-light btn-lg mx-sm-3 mx-2"
                href="/login"
                role="button"
              >
                Login
              </a>
              <a
                data-mdb-ripple-init
                className="btn btn-outline-light btn-lg"
                href="/register"
                role="button"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </header>
      
    </>
  );
}

export default Home;
