import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../Assets/Styles/LikeDislikeButton.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function LikeDislikeButton({ postId }) {
  const [reaction, setReaction] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const userId = localStorage.getItem("userId");

  function generateBrowserId() {
    let id = localStorage.getItem("browserId");
    if (!id) {
      id = Date.now().toString() + Math.random().toString(36).substring(2);
      localStorage.setItem("browserId", id);
    }
    return id;
  }

  const browserId = generateBrowserId();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/like-dislike/get-count/${postId}`)
      .then((response) => {
        const counts = response.data.data;
        setLikes(counts.likes);
        setDislikes(counts.dislikes);
      })
      .catch((error) => {
        console.error("Error fetching counts:", error);
      });

    const storedReaction = localStorage.getItem(`reaction-${postId}`);
    if (storedReaction) {
      setReaction(storedReaction);
    }
  }, [postId]);

  function handleReaction(type) {
    const currentReaction = reaction;

    if (currentReaction === type) {
      setReaction(null);
      localStorage.removeItem(`reaction-${postId}`);

      axios
        .post(`${API_BASE_URL}/like-dislike`, {
          postId,
          userId: userId || null,
          browserId: browserId,
          action: "remove",
        })
        .then(() => {
          refreshCounts();
        })
        .catch((err) => {
          console.error("Error removing reaction:", err);
        });
    } else {
      // New reaction
      setReaction(type);
      localStorage.setItem(`reaction-${postId}`, type);

      axios
        .post(`${API_BASE_URL}/like-dislike`, {
          postId,
          userId: userId || null,
          browserId: browserId,
          action: type,
        })
        .then(() => {
          refreshCounts();
        })
        .catch((err) => {
          console.error("Error sending reaction:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an error processing your reaction. Please try again.",
          });
        });
    }
  }

  function refreshCounts() {
    axios
      .get(`${API_BASE_URL}/like-dislike/get-count/${postId}`)
      .then((response) => {
        const counts = response.data.data;
        setLikes(counts.likes);
        setDislikes(counts.dislikes);
      })
      .catch((error) => {
        console.error("Error fetching updated counts:", error);
      });
  }

  return (
    <div className="blog-reaction-container">
      <button
        className={`blog-reaction-button ${
          reaction === "like" ? "blog-reaction-liked" : ""
        }`}
        onClick={() => handleReaction("like")}
        data-tooltip="Like this post"
      >
        <span className="blog-reaction-icon">👍</span>
        <span className="blog-reaction-count">{likes}</span>
      </button>
      <button
        className={`blog-reaction-button ${
          reaction === "dislike" ? "blog-reaction-disliked" : ""
        }`}
        onClick={() => handleReaction("dislike")}
        data-tooltip="Dislike this post"
      >
        <span className="blog-reaction-icon">👎</span>
        <span className="blog-reaction-count">{dislikes}</span>
      </button>
    </div>
  );

}

export default LikeDislikeButton;
