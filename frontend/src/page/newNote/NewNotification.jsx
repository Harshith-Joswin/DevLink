import React from "react";
import { toast } from 'react-toastify';

export default function NewNotification(props) {
    const notification = props.data;
    toast.info(notification.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        icon: "🔔"
        });
        return
}