import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../profile/profile.jpg';
import "../posts/post.css";
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';


export default function Posts(props) {
    const post = props.post;
    const user = props.user;
    const [showUpload, setShowUpload] = useState(false);
    const navigate = useNavigate();
    const [showComment, setShowComment] = useState(false);
    const [showBid, setShowBid] = useState(false);
    const [comments, setComments] = useState([]);
    const [bids, setBids] = useState([]);
    const [bid, setBid] = useState([]);
    const [comment, setComment] = useState();
    const [amount, setAmount] = useState();
    const [commentedUsers, setCommentedUsers] = useState();
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [currentUser, setCurrentUser] = useState(); //logged user
    const [solution, setSolution] = useState(null);

    async function fetchComment() {
        try {
            const response = await fetch(`http://localhost:4000/api/post/` + post._id + '/comment/?page=1&limit=100', {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const newComment = await response.json();
            setComments(newComment.comments);

            setShowComment(true);
        } catch (error) {
            console.error('Error fetching comment:', error);
        }
    }

    async function fetchBid(event) {
        try {
            const response = await fetch(`http://localhost:4000/api/post/${post._id}/bids?page=1&limit=10`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const newComment = await response.json();
            setBids(newComment.bids);
            setShowBid(true);
        } catch (error) {
            console.error('Error fetching comment:', error);
        }
    }

    async function makeComment(comment) {
        try {
            const response = await fetch('http://localhost:4000/api/post/' + post._id + '/comment/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token': localStorage.getItem('devlinktoken')
                },
                body: JSON.stringify({
                    'content': comment
                })
            })

            if (response.status == 200) {
                toast.success("Commented successfully", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
        catch (e) {
            console.log(e);
        }


    }

    async function makeBid() {
        try {
            const response = await fetch(`http://localhost:4000/api/post/${post._id}/bid/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token': localStorage.getItem('devlinktoken')
                },
                body: JSON.stringify({
                    'amount': (parseInt(bid))
                })
            });

            if (response.status == 200) {
                toast.success("Bid posted successfully", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            if (response.status == 401) {
                toast.error("Already bid posted, to change please delete it and re-post new bid", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            console.log(response);

        }
        catch (e) {
            console.log(e);
        }


    }

    const toggleLike = async () => {
        if (isLiked) {
            setIsLiked(false);
            post.likesCount--;
        }
        else {
            setIsLiked(true);
            post.likesCount++;
        }
        const response = await fetch('http://localhost:4000/api/post/' + post._id + '/like', {
            method: "POST",
            headers: {
                'auth_token': localStorage.getItem('devlinktoken')
            }
        })

    }

    const toggleComment = async () => {
        if (showComment) {
            setShowComment(false);
        }
    };

    const toggleBid = async () => {
        if (showBid) {
            setShowBid(false);
        }
        setBid('')
    };

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

    const deleteComment = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/post/comment/` + id, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token': localStorage.getItem('devlinktoken')
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            fetchComment();

            //fetchComment();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }


    const deleteBid = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/post/bid/` + id, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token': localStorage.getItem('devlinktoken')
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            fetchBid();
        } catch (error) {
            console.error('Error deleting bid:', error);
        }
    }


    async function fetchUser() {
        try {
            const response = await fetch(`http://localhost:4000/api/profile`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth_token': localStorage.getItem('devlinktoken')
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const user = await response.json();
            setCurrentUser(user._id);
        }
        catch (e) {

        }
    }

    useEffect(() => {
        fetchUser();
    });


    const FileInput = () => {

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop: (acceptedFiles) => {
                if (acceptedFiles[0].type === 'application/zip' || acceptedFiles[0].type === 'application/x-rar-compressed' || acceptedFiles[0].type === 'application/x-7z-compressed')
                    setSolution(acceptedFiles[0]);
            },
        });

        return (
            <div {...getRootProps()} className="dropzone">
                <input accept=".zip,.rar,.7z" {...getInputProps()} />
                {
                    isDragActive ? <p>Drop the file here ...</p> : <p>Drag and drop a file here, or click to select a file</p>
                }
                {
                    solution && (
                        <p>
                            Selected file: {solution.name} ({solution.type})
                        </p>
                    )
                }
            </div>
        );
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData();
        if (solution) {
            data.append('solution', solution);
        }

        const response = await fetch('http://localhost:4000/api/solution/upload/'+post._id, {
            method: "POST",
            headers: {
                'auth_token': localStorage.getItem('devlinktoken')
            },
            body: data
        });

        if (response.ok) {
            setShowUpload(false);
        } else {
            console.log("Failed to update profile");
        }

    }

    async function downloadSolution(){
        const response = await fetch('http://localhost:4000/api/solution/download/'+post._id, {
            method: "GET",
            headers: {
                'auth_token': localStorage.getItem('devlinktoken')
            }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'solution_' + post._id + '.zip'; // adjust the filename as needed
            a.click();
            URL.revokeObjectURL(url);
          } else {
            console.error('Error downloading file:', response.status, response.statusText);
          }
    }

    return (
        <>
            <div className="post" id="post_">
                <div className="post_meta">
                    <img src={(user.profilePhotoURL) ? 'http://localhost:4000/api/profile/photo/' + user.profilePhotoURL : defaultAvatar} alt="" className="profile" onClick={(e) => { navigate("/profile/" + user.id); }} />
                    <div className="name">
                        <span><b>{user.firstName + " " + user.lastName}</b></span>
                        <span>{user.username}</span>
                    </div>
                    <div className="tmp">
                        <div className="Budget">Budget: ₹{post.budget} </div>
                        <div className="date">{timeAgo(post.createdAt)} </div>
                    </div>

                </div>
                <div className="post_content" id="post_content_">
                    <div>Title: &nbsp; <b>{post.title}</b>
                    </div>
                    <div>Description: &nbsp; {post.description}
                    </div>
                    <div>Platforms:
                        {post.platforms.map((platform, index) => (<div className="platform" key={post._id + 'platform' + index}>{platform}</div>))}
                    </div>
                    <div>Technologies:
                        {post.technologies.map((technology, index) => (<div className="technology" key={post._id + 'technology' + index}>{technology}</div>))}
                    </div>
                </div>
                <div className="injected">
                    <div id="carouselExampleIndicators" className="carousel slide">
                        <div className="images carousel-indicators">
                            {post.imagesURL.map((img, index) => (
                                <button type="button" key={post._id + 'imageButton' + index} data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} className="active" aria-current="true" aria-label={"Slide " + { index }}></button>
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {post.imagesURL.map((img, index) => (
                                <div className="carousel-item active" key={post._id + 'image' + index}>
                                    <img src={'http://localhost:4000/api/post/photo/' + img}
                                        className="d-block w-100"
                                        alt="post photo"
                                        style={{ width: '500px', height: '500px', objectFit: 'cover' }} />
                                </div>

                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div style={{ width: '100%', padding: '10px' }}>
                        {post.documentsURL.map((doc, index) => (
                            <a key={post._id + 'doc' + index}
                                href={'http://localhost:4000/api/post/document/' + doc}
                                download={`document${index + 1}.pdf`}
                                className="document"
                                style={{ cursor: 'pointer', color: 'black', textDecoration: 'none', backgroundColor: 'cyan', borderRadius: '10px', padding: '0px 10px' }}
                            >
                                document {index + 1}
                            </a>
                        ))}

                    </div>
                </div>
                <div className="foot p-1 bg-light d-flex justify-content-between" style={{ width: 100 + '%' }}>
                    <div>
                        <button className={isLiked ? 'btn btn-primary m-1 ' : 'btn btn-secondary m-1 '} onClick={toggleLike} >
                            {/* Like */}{post.likesCount + ' '}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" /></svg>
                        </button>
                        <button className='btn btn-secondary m-1' onClick={fetchComment}>
                            {/* comment */}{(comments.length) ? (comments.length) : (post.commentsCount) + ' '}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" /></svg>
                        </button>
                        <button className='btn btn-success m-1' onClick={fetchBid}>
                            {/* comment */}
                            <b>₹</b>
                        </button>
                        {props.AcceptedProjects && <button className='btn btn-danger m-1' onClick={() => { setShowUpload(true); }}>
                            {/* submit solution */}
                            Submit solution
                        </button>
                        }
                        {
                            props.MyPosts && post.isCompleted && <div key={post._id + 'doc'} className='btn btn-success m-1'
                            // href={'http://localhost:4000//api/solution/download/' + post._id}
                            onClick={downloadSolution}
                            //download={`solution_${post._id}.${solution.name.split('.').pop()}`}
                          >Download solution</div>
                        }

                    </div>

                    <div>
                        <button className='btn btn-secondary m-1'>
                            {/* share */}
                            <svg className="invert" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z" /></svg>
                        </button>
                    </div>
                    {/* <button className='btn btn-danger m-1'>Report</button> */}
                </div>
            </div>



            {showComment && (
                <div className="showComment1">
                    <div className="container1">
                        <div className="details1">
                            {/* commentSection */}
                            <div className="comment-section1" style={{ borderBottom: "1px solid #00000029" }}>
                                {comments.map((comment, index) => {
                                    return (
                                        <p className="comm" key={comment._id + 'comments' + index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <img style={{ width: '50px', height: '50px', marginRight: '20px' }} src={comment.user.profilePhotoURL ? 'http://localhost:4000/api/profile/photo/' + comment.user.profilePhotoURL : defaultAvatar} alt="" className="profile" onClick={(e) => { navigate("/profile/" + comment.user._id); }} />
                                                <span className="commenter1" style={{ fontWeight: "bolder" }}>
                                                    {comment.user.username}{" "}
                                                </span>
                                                <span className="commentText1">{comment.content}</span>
                                            </div>

                                            {
                                                (comment.user._id == currentUser) &&
                                                (<span style={{ marginRight: '50px', color: 'red' }} onClick={() => { deleteComment(comment._id) }}>X</span>)
                                            }
                                        </p>
                                    );
                                })}
                            </div>

                            {/* add Comment */}
                            <div className="add-comment1">
                                <span className="material-symbols-outlined1">mood</span>
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={comment}
                                    onChange={(e) => { setComment(e.target.value) }}
                                />
                                <button
                                    className="comment"
                                    onClick={() => {
                                        makeComment(comment);
                                        setComment("");
                                        toggleComment();
                                    }}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="close-comment1"
                        onClick={() => {
                            toggleComment();
                        }}
                    >
                        <span className="material-symbols-outlined1 material-symbols-outlined-comment1" style={{ color: 'red' }} onClick={toggleComment}>
                            X
                        </span>
                    </div>
                </div>
            )}


            {showBid && (
                <div className="showComment1">
                    <div className="container1">
                        <div className="details1">

                            {/* Bidding section */}
                            <div className="comment-section1" style={{ borderBottom: "1px solid #00000029" }}>
                                {bids.map((comment, index) => {
                                    return (
                                        <p className="comm" key={comment._id + 'comments' + index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <img style={{ width: '50px', height: '50px', marginRight: '20px' }} src={comment.user.profilePhotoURL ? 'http://localhost:4000/api/profile/photo/' + comment.user.profilePhotoURL : defaultAvatar} alt="" className="profile" onClick={(e) => { navigate("/profile/" + comment.user._id); }} />
                                                <span className="commenter1" style={{ fontWeight: "bolder" }}>
                                                    {comment.user.username}{" "}
                                                </span>
                                                <span className="commentText1">{' ₹' + comment.amount}</span>
                                            </div>

                                            {
                                                (comment.user._id == currentUser) &&
                                                (<span style={{ marginRight: '50px', color: 'red' }} onClick={() => { deleteBid(comment._id) }}>X</span>)
                                            }
                                        </p>
                                    );
                                })}
                            </div>

                            {/* add Comment */}
                            <div className="add-comment1">
                                <input
                                    type="number"
                                    placeholder="Bid!!"
                                    value={bid}
                                    onChange={(e) => { setBid(e.target.value) }}
                                />
                                <button
                                    className="comment1"
                                    onClick={() => {
                                        makeBid();
                                        toggleBid();
                                    }}
                                >
                                    Bid
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="close-comment1"
                        onClick={() => {
                            toggleBid();
                        }}
                    >
                        <span className="material-symbols-outlined1 material-symbols-outlined-comment1" style={{ color: 'red' }} onClick={toggleBid}>
                            X
                        </span>
                    </div>
                </div>
            )}

            {showUpload && (
                <div className="showComment1">
                    <form onSubmit={handleSubmit} method="POST" className="container1" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <label htmlFor="solution" className="form-label ">
                            Upload Solution (only .zip, .rar, .7z, .gz)
                        </label>
                        <div name="solution" className="border border-dark p-2 rounded">
                            <FileInput />
                        </div>
                        <input type="submit" value={"Upload"} />
                    </form>
                    <div
                        className="close-comment1"
                        onClick={() => {
                            setShowUpload(false);
                        }}
                    >
                        <span className="material-symbols-outlined1 material-symbols-outlined-comment1" style={{ color: 'red' }} onClick={toggleBid}>
                            X
                        </span>
                    </div>
                </div>
            )}

        </>
    )
}