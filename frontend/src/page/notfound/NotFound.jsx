import React from 'react'

function NotFound() {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center background text-bg-primary'>
      <h1>Page Not Found :(</h1>
      <a href="/" className='btn btn-primary p-2 '>Go to Home Page</a>
    </div>
  )
}

export default NotFound
