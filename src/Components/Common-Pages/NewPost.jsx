import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import "../../Assets/Styles/NewPost.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function NewPost() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must be a user and logged in to access this page.",
      }).then(() => {
        navigate("/UserLogin");
      });
    }
  }, []);

  const usersId = localStorage.getItem("userId");
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [suggestedTags, setSuggestedTags] = useState([]);

  const [newPostData, setNewPostData] = useState({
    userId: `${usersId}`,
    title: '',
    content: '',
    category: '',
    hashtags: '',
    image: ''
  });

  const handleChange = (e) => {
    setNewPostData({
      ...newPostData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewPostData({ ...newPostData, image: file });
  };

  const SubmitForm = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to publish this post?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${API_BASE_URL}/AddPost`, newPostData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          .then((up) => {
            if (up.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Post Published!",
                text: "Your blog post has been successfully published. Once approved by admin, it will be on the profile",
                confirmButtonText: "View Posts"
              }).then(() => {
                navigate("/UserProfile");
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save the post. Please try again.",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "Server Error",
              text: "Something went wrong. Contact admin.",
            });
          });
      }
    });
  };

  // 🎤 Voice to Text Hook
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const rawTranscript = event.results[i][0].transcript.trim();
          const punctuated = punctuateText(rawTranscript);
          transcript += punctuated + ' ';
        }
        setNewPostData(prev => ({
          ...prev,
          content: prev.content + ' ' + transcript.trim()
        }));
      };

      function punctuateText(text) {
        text = text.charAt(0).toUpperCase() + text.slice(1);
        if (!/[.!?]$/.test(text)) {
          text += '.';
        }
        text = text.replace(/,(\S)/g, ', $1');
        return text;
      }

      recognition.onerror = (e) => {
        console.error("Mic error:", e);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsRecording(!isRecording);
  };

  const generateHashtags = () => {
    const inputText = `${newPostData.title} ${newPostData.content}`;
    if (!inputText.trim()) return;

    axios.post(
      'https://api-inference.huggingface.co/models/dslim/bert-base-NER',
      { inputs: inputText },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`
        }
      }
    )
    .then(res => {
      const entities = res.data || [];
      const keywords = entities.map(e => e.word).filter(Boolean);
      setSuggestedTags(keywords);
    })
    .catch(err => {
      console.error("Tag suggestion failed:", err);
      setSuggestedTags([]);
    });
  };

  return (
    <div>
      <Navbar />
      <div className="npd-wrapper">
        <div className="npd-card">
          <div className="npd-sidebar-accent"></div>
          <div className="npd-content">
            <h2 className="npd-title">Write Your New Blog Post</h2>
            <form onSubmit={SubmitForm}>

              <div className="npd-group">
                <label htmlFor="title" className="npd-label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPostData.title}
                  onChange={handleChange}
                  className="npd-input"
                  required
                  placeholder="Enter blog title"
                />
              </div>

              <div className="npd-group">
                <label htmlFor="content" className="npd-label">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={newPostData.content}
                  onChange={handleChange}
                  className="npd-textarea"
                  required
                  placeholder="Write your blog content here..."
                />
                <button
                  type="button"
                  className={`mic-btn ${isRecording ? 'recording' : ''}`}
                  onClick={handleMicClick}
                  style={{ marginTop: "10px" }}
                >
                  {isRecording ? '🛑 Stop Mic' : '🎤 Lazy to Type? Talk then'}
                </button>

                <button
                  type="button"
                  className="npd-suggest-btn"
                  onClick={generateHashtags}
                  style={{ marginTop: "10px", marginLeft: "10px" }}
                >
                  🔍 Suggest Hashtags
                </button>

                {suggestedTags.length > 0 && (
                  <div className="npd-suggested-tags">
                    <p>Suggested Hashtags (click to add):</p>
                    <div className="npd-tag-list">
                      {suggestedTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="npd-tag"
                          onClick={() => {
                            setNewPostData(prev => ({
                              ...prev,
                              hashtags: prev.hashtags
                                ? `${prev.hashtags}, ${tag.replace(/\s+/g, '')}`
                                : tag.replace(/\s+/g, '')
                            }));
                          }}
                        >
                          #{tag.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="npd-group">
                <label htmlFor="category" className="npd-label">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newPostData.category}
                  onChange={handleChange}
                  className="npd-select"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Programming">Programming</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="Web-Development">Web Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Gadgets">Gadgets</option>
                  <option value="Mobile-Phones">Mobile Phones</option>
                  <option value="Technology">Technology</option>
                  <option value="News">News</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="npd-group">
                <label htmlFor="hashtags" className="npd-label">Hashtags</label>
                <input
                  type="text"
                  id="hashtags"
                  name="hashtags"
                  value={newPostData.hashtags}
                  onChange={handleChange}
                  className="npd-input"
                  placeholder="e.g., tech, AI, webdev"
                />
              </div>

              <div className="npd-group">
                <label htmlFor="image" className="npd-label">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="npd-input"
                  accept="image/*"
                />
              </div>

              <button type="submit" className="npd-submit-btn">Publish Post</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NewPost;
