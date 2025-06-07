import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import '../../Assets/Styles/AuthorProfile.css';

function AuthorProfile() {
  const { authorId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setLoadingUser(true);
    axios.post(`${API_BASE_URL}/UserProfile/${authorId}`)
      .then(res => {
        setUser(res.data.data || res.data);
        setLoadingUser(false);
      })
      .catch(() => {
        setLoadingUser(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load author profile.'
        });
      });

    setLoadingPosts(true);
    axios.post(`${API_BASE_URL}/UsersPosts/${authorId}`)
      .then(res => {
        setPosts(res.data.data || res.data);
        setLoadingPosts(false);
      })
      .catch(() => {
        setLoadingPosts(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load posts.'
        });
      });
  }, [authorId, API_BASE_URL]);

  if (loadingUser) return <p className="ap-loading-uniq">Loading author profile...</p>;
  if (!user) return <p className="ap-error-uniq">Author not found.</p>;

  const openPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <>
      <Navbar />
      <div className="ap-wrapper-uniq">
        <div className="ap-container-uniq">
          <div className="ap-header-uniq">
            <div className="ap-avatar-uniq">
              <img src={user?.image} alt="avatar" />
            </div>
            <h2 className="ap-name-uniq">{user.fullName}</h2>
            <p className="ap-username-uniq">@{user.username}</p>
            <p className="ap-about-uniq">{user.bio || "This author hasn't added a bio yet."}</p>
          </div>

          <h3 className="ap-section-title-uniq">Posts by {user.fullName}</h3>

          {loadingPosts ? (
            <p className="ap-loading-uniq">Loading posts...</p>
          ) : posts.length > 0 ? (
            <div className="ap-posts-uniq">
              {posts.slice().reverse().map(post => (
                <div
                  key={post._id}
                  className="ap-post-card-uniq"
                  onClick={() => openPost(post._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt="post"
                      className="ap-post-img-uniq"
                    />
                  )}
                  <div className="ap-post-content-uniq">
                    <h4>{post.title}</h4>
                    <p>{post.content ? post.content.slice(0, 100) + '...' : 'No description available.'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="ap-no-posts-uniq">No posts by this author yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AuthorProfile;
