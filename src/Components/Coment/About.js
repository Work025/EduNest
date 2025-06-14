import { useState, useEffect } from "react";
import "./About.css";

function About() {
    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostImage, setNewPostImage] = useState(null);
    const [commentingPostIndex, setCommentingPostIndex] = useState(null);
    const [currentComment, setCurrentComment] = useState("");

    // Foydalanuvchi ma'lumotlari
    const user = JSON.parse(sessionStorage.getItem("user")) || {};
    const username = user?.name || "Guest";
    const userImage = user?.image || "";

    // Barcha postlarni localStorage'dan olish (umumiy: global_posts)
    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("global_posts")) || [];
        setPosts(storedPosts);
    }, []);

    // Postlar o‘zgarganda saqlash (umumiy: global_posts)
    useEffect(() => {
        localStorage.setItem("global_posts", JSON.stringify(posts));
    }, [posts]);

    // Post qo‘shish
    const handleAddPost = () => {
        if (!newPostTitle || !newPostImage) return;

        const newPost = {
            title: newPostTitle,
            image: URL.createObjectURL(newPostImage),
            author: username,
            authorImage: userImage,
            likes: [],
            dislikes: 0,
            comments: []
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        setNewPostTitle("");
        setNewPostImage(null);
    };

    // Like bosish
    const handleLike = (index) => {
        const updated = [...posts];
        const alreadyLiked = updated[index].likes.includes(username);
        if (!alreadyLiked) {
            updated[index].likes.push(username);
            setPosts(updated);
        }
    };

    // Dislike bosish
    const handleDislike = (index) => {
        const updated = [...posts];
        updated[index].dislikes++;
        setPosts(updated);
    };

    // Komment yozish
    const handleCommentSubmit = () => {
        if (!currentComment) return;

        const updated = [...posts];
        updated[commentingPostIndex].comments.push({
            user: username,
            text: currentComment
        });

        setPosts(updated);
        setCurrentComment("");
        setCommentingPostIndex(null);
    };

    return (
        <div className="web-photo">
            <div className="web-tube">
                <div className="tube-name">
                    <div className="tube-name-h1">
                        <h1>My web name: @{username}</h1>
                    </div>
                    <div className="tube-name-subiscrabe">
                        <p>Total Likes:</p>
                        <span>
                            {posts.reduce((acc, post) => acc + post.likes.length, 0)}
                        </span>
                    </div>
                </div>
                <div className="tube-video">
                    <div className="tube-video-make">
                        <input
                            type="text"
                            placeholder="Write post title..."
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewPostImage(e.target.files[0])}
                        />
                        <button onClick={handleAddPost}>Upload Post</button>
                    </div>

                    <div className="post-list">
                        {posts.map((post, index) => (
                            <div key={index} className="mini-post">
                                <img src={post.image} alt="post" />
                                <div>
                                    <p><strong>{post.title}</strong></p>
                                    <div className="author-info">
                                        {post.authorImage && (
                                            <img
                                                src={post.authorImage}
                                                alt="author"
                                                className="author-avatar"
                                            />
                                        )}
                                        <p>By: @{post.author}</p>
                                    </div>

                                    <div className="icons">
                                        <i
                                            className={`fa fa-heart ${post.likes.includes(username) ? "liked" : ""}`}
                                            onClick={() => handleLike(index)}
                                        ></i>
                                        <span>{post.likes.length}</span>

                                        <i className="fa fa-thumbs-down" onClick={() => handleDislike(index)}></i>
                                        <span>{post.dislikes}</span>

                                        <i className="fa fa-comment" onClick={() => setCommentingPostIndex(index)}></i>
                                    </div>

                                    <div className="comment-section">
                                        <ul>
                                            {post.comments.map((comment, i) => (
                                                <li key={i}>
                                                    <strong>{comment.user}:</strong> {comment.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {commentingPostIndex !== null && (
                    <div className="comment-popup">
                        <button className="close-comment" onClick={() => setCommentingPostIndex(null)}>×</button>
                        <textarea
                            value={currentComment}
                            onChange={(e) => setCurrentComment(e.target.value)}
                            placeholder="Write your comment..."
                        />
                        <button onClick={handleCommentSubmit}>Submit</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default About;
