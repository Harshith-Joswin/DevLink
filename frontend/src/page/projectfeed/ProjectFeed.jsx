import React from 'react'
import reactLogo from '../../assets/react.svg'
import './projectfeed.css'
import { useNavigate } from 'react-router-dom'

function ProjectFeed() {
  let navigate = useNavigate();
  const logout =() =>{
    localStorage.removeItem('devlinktoken');
    navigate("/")
  }

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
            <a href="/" className="text-reset text-decoration-none mx-2">DevLink</a>
          </div>
          <div className="navbar-item">
            <a href="#" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 " onClick={logout}>Logout</a>
            <a href="/profile" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">Profile</a>
          </div>
      </nav>

      <div className="container">
        <div className="card overflow-hidden m-2">
            <div className="head bg-dark row">
                <img src={reactLogo} alt="profile photo" className='prof col-1 m-2'/>
                <div className='text-white name d-flex justify-content-left align-items-center col'>Name & Username & createdDate</div>
                <div className='bg-success rounded d-flex justify-content-center align-items-center p-2 text-white fs-6'>Current Bid:$1000</div>
            </div>
            <div className="body row p-2 bg-primary">
                <span className='p-2'>Project Title: Something new</span>
                <span className='p-2 overflow-auto'>Platforms: 
                    <span className='bg-warning rounded p-1 m-1'>Windows</span>
                    <span className='bg-warning rounded p-1 m-1'>Linux</span>
                    <span className='bg-warning rounded p-1 m-1'>Mac</span>
                    <span className='bg-warning rounded p-1 m-1'>Web</span>
                </span>
                <span className='p-2 overflow-auto'>Technologies: 
                    <span className='bg-warning rounded p-1 m-1'>Blockchain</span>
                    <span className='bg-warning rounded p-1 m-1'>E2EE</span>
                </span>
                <span></span>
                <div className="container overflow-auto d-flex">
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                </div>
            </div>
            <div className="foot p-1 bg-dark d-flex justify-content-between">
              <div>
              <button className='btn btn-primary m-1'>
                  {/* Like */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
                </button>
                <button className='btn btn-primary m-1'>
                  {/* comment */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                </button>
              </div>

                <div>
                <button className='btn btn-primary m-1'>
                  {/* share */}
                <svg className="invert" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"/></svg>
                </button>
                </div>
                {/* <button className='btn btn-danger m-1'>Report</button> */}
            </div>
      </div>
      </div>

      <div className="container">
        <div className="card overflow-hidden m-2">
            <div className="head bg-dark row">
                <img src={reactLogo} alt="profile photo" className='prof col-1 m-2'/>
                <div className='text-white name d-flex justify-content-left align-items-center col'>Name & Username & createdDate</div>
                <div className='bg-success rounded d-flex justify-content-center align-items-center p-2 text-white fs-6'>Current Bid:$1000</div>
            </div>
            <div className="body row p-2 bg-primary">
                <span className='p-2'>Project Title: Something new</span>
                <span className='p-2 overflow-auto'>Platforms: 
                    <span className='bg-warning rounded p-1 m-1'>Windows</span>
                    <span className='bg-warning rounded p-1 m-1'>Linux</span>
                    <span className='bg-warning rounded p-1 m-1'>Mac</span>
                    <span className='bg-warning rounded p-1 m-1'>Web</span>
                </span>
                <span className='p-2 overflow-auto'>Technologies: 
                    <span className='bg-warning rounded p-1 m-1'>Blockchain</span>
                    <span className='bg-warning rounded p-1 m-1'>E2EE</span>
                </span>
                <span></span>
                <div className="container overflow-auto d-flex">
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                    <img src={reactLogo} alt="post photo" className='content m-2 border border-dark rounded'/>
                </div>
            </div>
            <div className="foot p-1 bg-dark d-flex justify-content-between">
              <div>
              <button className='btn btn-primary m-1'>
                  {/* Like */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
                </button>
                <button className='btn btn-primary m-1'>
                  {/* comment */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                </button>
              </div>

                <div>
                <button className='btn btn-primary m-1'>
                  {/* share */}
                <svg className="invert" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"/></svg>
                </button>
                </div>
                {/* <button className='btn btn-danger m-1'>Report</button> */}
            </div>
        </div>


        
      </div>
    </>
  )
}

export default ProjectFeed
