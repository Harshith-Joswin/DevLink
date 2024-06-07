import React from 'react'
import Navbar from '../nav/Navbar'
// import './unDev.css'

function UnderDevelopment() {
  return (
    <>
    <Navbar></Navbar>

    {/* Main content */}
      <main id="main" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh'}}>
      <h1>Under Development</h1>
      <p>This page is under development. While we are working on it feel free to explore other features!!</p>
    </main>
    </>
  )
}

export default UnderDevelopment
