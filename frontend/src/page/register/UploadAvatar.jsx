import React, {useState} from "react";
import Avatar from "react-avatar-edit";
import picture from './wall10.jpg'

function UploadAvatar() {
    const [src, setSrc] = useState(picture)
    const [preview, setPreview] = useState(null)

  return (
    <div>
      <Avatar 
        src = {src}
      />
    <img src={preview} alt="profile-photo" />
    </div>

  )
}

export default UploadAvatar

