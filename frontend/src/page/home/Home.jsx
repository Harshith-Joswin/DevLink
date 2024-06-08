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
              <h4 className="mb-3" style={{fontSize:'16px', fontWeight:'lighter'}}>
                DevLink is a cutting-edge platform engineered to revolutionize the way software
                development projects are commissioned and executed. This platform provides a dynamic
                space where problem posters, such as companies or individuals, can post detailed descriptions
                of their software needs along with a predetermined cash reward for the successful completion
                of the project. Developers, ranging from seasoned professionals to promising newcomers, can
                bid on these projects by proposing competitive rates, with the developer offering the lowest
                bid typically being awarded the contract.
              </h4><br/>
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
