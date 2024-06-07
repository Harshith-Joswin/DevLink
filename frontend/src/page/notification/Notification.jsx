import { useEffect, useState } from "react";
import './notification.css'

export default function Notifications() {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/notification", {
                    method: "POST",
                    headers: {
                        "auth_token": localStorage.getItem('devlinktoken'),
                    }
                });
                if (response.status == 200) {
                    const json = await response.json();
                    setNotification(json);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    function timeAgo(date) {
        const now = new Date();
        const postDate = new Date(date);
        const secondsAgo = Math.floor((now - postDate) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(secondsAgo / interval.seconds);
            if (count > 0) {
                return count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`;
            }
        }

        return 'just now';
    }

    if (notification && !notification.count) {
        return (
            <main id="main" style={{display:"flex", justifyContent:"center", height:"100vh", color:"gray"}}>
                <h3>No Notifications Yet... :(</h3>
            </main>
        )
    }
        return (
            <main id="main">
                {notification && notification.notifications.map(note => {
                    return (
                        <div className={note.new ? "notification new" : "notification"}>
                            <img className="NoteIcon" src='' />
                            <div className="message">{note.message}
                                <div style={{ color: 'gray' }}>{timeAgo(note.createdAt)}</div></div>
                        </div>
                    )
                })}
            </main>
        );
}